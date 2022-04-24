const express = require("express")
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('we will run the mongodb')
})

// user: userInfo
// password: tFEpt1fJeHdG85oh

const uri = "mongodb+srv://userInfo:tFEpt1fJeHdG85oh@cluster0.ubuty.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("userInfo").collection("user");

        // show all users into Client server from database using this API
        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })
        // get single user for update 
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })
        // post user : add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = userCollection.insertOne(newUser)
            res.send(result)
        })
        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        // delete user
        app.delete('/user:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally { }
}
run().catch(console.dir)



app.listen(port, () => {
    console.log('CRUD server is running')
})