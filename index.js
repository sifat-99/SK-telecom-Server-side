const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5001;

// middleware

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASSWORD)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kysojnx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();



    app.post('/addProduct', async (req, res) => {
        const product = req.body;
        console.log(product)
        const result = await client.db("SifStore").collection("products").insertOne(product);
        console.log(result)
        res.send(result);
    });

    app.post('/addProduct/Cart', async (req, res) => {
        const order = req.body;
        console.log(order)
        const result = await client.db("SifStore").collection("Cart").insertOne(order);
        console.log(result)
        res.send(result);
    }
    );
    app.get('/cart', async (req, res) => {
        const cursor = client.db("SifStore").collection("Cart").find({});
        const products = await cursor.toArray();
        res.send(products);
    }
    );
    // get single product from id
    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id)
        const query = { _id: new ObjectId(id) };
        const product = await client.db("SifStore").collection("products").findOne(query);
        res.send(product);
    });

    // Update single product from id
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      console.log('updating product', id)
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          Price: updatedProduct.Price,
          quantity: updatedProduct.quantity,
          category: updatedProduct.category,
          photo: updatedProduct.photo,
        },
      };
      const result = await client.db("SifStore").collection("products").updateOne(filter, updateDoc, options);
      console.log(result)
      res.send(result);

    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log('deleting product', id)
      const query = { _id: new ObjectId(id) };
      const result = await client.db("SifStore").collection("Cart").deleteOne(query);
      console.log(result)
      res.send(result);
    }
    );


    app.get('/products', async (req, res) => {
        const cursor = client.db("SifStore").collection("products").find({});
        const products = await cursor.toArray();
        res.send(products);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// routes

app.get('/', (req, res) => {
    res.send('Here is the main api... go to /products for the products!');
    });

    


// listen

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    });