const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); // Use dotenv to manage sensitive info
const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToDb() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB!");
    db = client.db('LUMScapeDB'); 
  } catch (err) {
    console.error(err);
  }
  
}

connectToDb();


app.get('/data', async (req, res) => {
  try {
    const data = await db.collection("test").find({}).toArray();
    console.log("Data fetched from MongoDB:", data); // Print to console
    res.json(data); // Send data to the client
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
