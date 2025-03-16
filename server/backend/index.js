const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); // Use dotenv to manage sensitive info
const app = express();
// const port = process.env.PORT;
// const port =10000;
// const uri = process.env.MONGO_URI;
const uri = "mongodb+srv://LUMScape:diddyparty16!@lumscape.md59v.mongodb.net";


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
    console.log("here");
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB!");
    console.log("Connected successfully to MongoDB!");
    db = client.db('LUMScapeDB'); 
    console.log("Connected successfully to MongoDB!");
  } catch (err) {
    console.error(err);
  }
  
}
console.log("here");


app.get('/locations', async (req, res) => {
  await connectToDb();
  try {
    const data = await db.collection("locations").find({}).toArray();
    console.log("Data fetched from MongoDB:", data); // Print to console
    res.json(data); // Send data to the client
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/eateries', async (req, res) => {
  await connectToDb();
  try {
    const data = await db.collection("eateries").find({}).toArray();
    console.log("Data fetched from MongoDB:", data); // Print to console
    res.json(data); // Send data to the client
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/events', async (req, res) => {
  await connectToDb();
  try {
    const data = await db.collection("events").find({}).toArray();
    console.log("Data fetched from MongoDB:", data); // Print to console
    res.json(data); // Send data to the client
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});
app.get('/offices', async (req, res) => {
  await connectToDb();
  try {
    const data = await db.collection("offices").find({}).toArray();
    console.log("Data fetched from MongoDB:", data); // Print to console
    res.json(data); // Send data to the client
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: error.message });
  }
});

// app.listen()
// app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;