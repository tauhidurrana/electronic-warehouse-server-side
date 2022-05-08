const express = require('express');
const cors = require ('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json())



// user and password

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse1.twttu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try {
        await client.connect();
        const itemCollection = client.db('warehouseManage').collection('Items');
        
        // Items API
        app.get('/items', async(req, res)=>{
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        })

        // Single Item API
        app.get('/items/:id', async(req, res)=>{
            const id =  req.params.id;
            const query = {_id:ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        })

        // Post Item
        app.post('/items', async(req, res)=>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        })

        // Put quantity & update stock
        app.put('/item/update/:id', async(req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true}
            const updateDocument = {
                $set: {...data},
            }
            const result = await itemCollection.updateOne(filter, updateDocument, options);
            res.send(result);
        });

        // get my items
        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            console.log(email);  
            const query = {email: email};       
            const items = itemCollection.find(query);
            const result = await items.toArray();
            res.send(result);

        });
    }
    finally{
    
    }
}

run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('running server');
});

app.listen(port, ()=>{
    console.log('listening to port', port);
})