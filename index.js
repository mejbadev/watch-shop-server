const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const ObjectId = require('mongodb').ObjectId;
const port =process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run (){
    try{
        await client.connect();
        console.log('connected to database');
        const database = client.db('watchShop');
        const adminList = database.collection('adminUsers');
        const productCollection = database.collection('products');
        const userCollection= database.collection('users');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders');
        
        
        app.get('/adminUsers', async(req, res)=>{
            const cursor = adminList.find({});
            const adminUserList = await cursor.toArray();
            res.send(adminUserList);  
        });
        app.get('/users', async(req, res)=>{
            const cursor = userCollection.find({});
            const userList = await cursor.toArray();
            res.send(userList);  
        });
        app.get('/products', async(req, res)=>{
            const cursor = productCollection.find({});
            const productList = await cursor.toArray();
            res.send(productList);  
        });
        app.get('/products/:id', async (req, res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const product = await productCollection.findOne(query);
            console.log(product);
            res.json(product);
        });
        app.get('/orders/:id', async (req, res)=>{
            const id = req.params.id;
            const query ={_id:ObjectId(id)};
            const product = await orderCollection.findOne(query);
            console.log(product);
            res.json(product);
        });
        app.get('/orders', async(req, res)=>{
            const cursor = orderCollection.find({});
            const orderList = await cursor.toArray();
            res.send(orderList);  
        });

        app.get('/reviews', async(req, res)=>{
            const cursor = reviewCollection.find({});
            const reviewList = await cursor.toArray();
            res.send(reviewList);  
        });

        app.post('/products', async (req, res)=>{
            const product = req.body;
            console.log('hit the post api', product);
            const result = await productCollection.insertOne(product);
            console.log(result)
            res.json(result);
        });
        app.post('/adminUsers', async (req, res)=>{
            const product = req.body;
            console.log('hit the post api', product);
            const result = await adminList.insertOne(product);
            console.log(result)
            res.json(result);
        });
        app.post('/users', async (req, res)=>{
            const user = req.body;
            console.log('hit the post api', user);
            const result = await userCollection.insertOne(user);
            console.log(result)
            res.json(result);
        });
        app.post('/reviews', async (req, res)=>{
            const review = req.body;
            console.log('hit the post api', review);
            const result = await reviewCollection.insertOne(review);
            console.log(result)
            res.json(result);
        });
        app.post('/orders', async (req, res)=>{
            const order = req.body;
            console.log('hit the post api', order);
            const result = await orderCollection.insertOne(order);
            console.log(result)
            res.json(result);
        });
        app.put('/orders/:id', async (req, res)=>{
            const id= req.params.id;
            const updateOrder = req.body;
            console.log(req.body);
            const filter = {_id:ObjectId(id)}; 
            const option = {upsert: true};
            const updateDoc ={
                $set : {
                    status: updateOrder.status
                }
            };
      
            const result = await orderCollection.updateOne(filter, updateDoc, option);
            // const result = await users.updateOne(query, updateUser);
            res.json(result);
        });
        app.delete('/orders/:id', async (req, res)=>{
            const id= req.params.id;
            const query={_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
      
        });
        app.delete('/products/:id', async (req, res)=>{
            const id= req.params.id;
            const query={_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.json(result);
      
        });

    }finally{
        // client.close() 
    }
}

run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('running watch server');
})

app.listen(port, ()=>{
    console.log('running server on port:', port);
})