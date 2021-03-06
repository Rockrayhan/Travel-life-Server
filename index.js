const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const usersCollection = database.collection('users');

        //GET API (for services)
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });


        // GET Single Services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API ( for services )
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result);
        });



        // DELETE API 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        });


        // get user in db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        
        // upsert 
        // app.put ('/users', async (req,res)=> {
        //     const user = req.body ;
        //     const filter ={email: user.email};
        //     const options= {upsert: true};
        //     const updateDoc = {$set: user};
        //     const result = await usersCollection.updateOne(filter, updateDoc, options) ;
        //     res.json(result);
        // } )

            // For making admin
            app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // 
        app.get('/users/:email', async (req , res) => {
            const email = req.params.email ;
            const query = {email : email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false ;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({admin: isAdmin}) ;
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