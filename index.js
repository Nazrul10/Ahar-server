const express = require('express')
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvtu8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('food_delivery');
      const dataCollaction = database.collection('orders');
      const orderCollaction = database.collection('myorders');

      //GET API
      app.get('/orders', async(req, res)=>{
        const cursor = dataCollaction.find({});
        const order = await cursor.toArray();
        res.send(order)
    })
    //GEt All order
    app.get('/manageall', async(req, res)=>{
        const cursor = orderCollaction.find({});
        const order = await cursor.toArray();
        res.send(order)
    })
      //GET myOrder
      app.get('/myallorder/:email', async(req, res)=>{
        const cursor = await orderCollaction.find({email: req.params.email}).toArray();
        res.send(cursor)
    })
    //Get id
    app.get('/placeorder/:id', async(req, res)=>{
        const id = req.params.id
        const result = await dataCollaction.findOne({_id: ObjectId(id)})
        res.json(result)
    })
      //POST API
      app.post('/addfood', async (req, res)=>{
        const food = req.body
        const result = await dataCollaction.insertOne(food);
        res.json(result)
    })
    //delete order from the database
    app.delete("/deleteProduct/:id", async (req, res) => {
    console.log(req.params.id);
    orderCollaction.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      });
  });
    //delete Manage All order from the database
    app.delete("/deletemanage/:id", async (req, res) => {
    console.log(req.params.id);
    orderCollaction.deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result);
      });
  });
    //POST Orders
    app.post('/myorders', async (req, res)=>{
        const order = req.body
        const result = await orderCollaction.insertOne(order);
        res.json(result)
    })
    } 
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})