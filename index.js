const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId ;
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.shqkw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('travelLife');
        const servicesCollection = database.collection('services');
        const ordersCollection = database.collection('orders');
       
        //GET API (for services)
        app.get('/services', async(req , res)=> {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services) ;
        });

        // GET API (for orders)
        app.get('/orders', async(req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray() ;
            res.send(orders) ;
        });

        // GET Single Services
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id ;
            console.log('getting specific service' , id);
            const query = {_id: ObjectId(id)} ;
            const service = await servicesCollection.findOne(query) ;
            res.json(service) ;
        });

        // POST API ( for services )
        app.post('/services', async (req, res) => {
            const service = req.body ;
            console.log('hit the post api' , service);
            
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result);
        });

        // POST API ( for Order )
        app.post('/orders', async(req, res) => {
            const orders = req.body ;
            const result = await ordersCollection.insertOne(orders)
            res.json(orders);
        });

        // DELETE API 
        app.delete('/orders/:id', async(req,res)=>{
            const id = req.params.id ;
            const query = {_id: ObjectId(id) } ;
            const result = await ordersCollection.deleteOne(query) ;
            res.json(result) 
        })
    }
    finally {
        // await client.close();
    }

}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('requist has been hitted')
})


app.listen(port, () => {
    console.log('port has been hitted', port);
})