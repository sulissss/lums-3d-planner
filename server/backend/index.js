require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const crypto = require('crypto'); // Add this line

const app = express();
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;

let db;

async function connectToDb() {
  if (!db) {
    try {
      const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      db = client.db('LUMScapeDB');
      console.log("Connected to MongoDB!");
    } catch (err) {
      console.error("Database connection error:", err);
      throw err; // Throw the error instead of process.exit(1)
    }
  }
}

app.use(express.json());

// ... (rest of your fetchCollection, createDocument, etc. functions) ...

// Signup route
app.post('/users/signup', async (req, res) => {
  try {
    await connectToDb();
    const { email, password, scope } = req.body;
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex'); // Use crypto

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const result = await db.collection('users').insertOne({ email, password: encryptedPassword, scope });
    res.status(201).json({ message: "User created", id: result.insertedId });
  } catch (error) {
    console.error('users/signup error: ', error);
    res.status(500).json({ error: error.message });
  }
});

// Login route
app.post('/users/login', async (req, res) => {
  try {
    await connectToDb();
    const { email, password } = req.body;
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex'); // use crypto

    const user = await db.collection('users').findOne({ email });
    if (user && user.password === encryptedPassword) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('users/login error: ', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app; // Remove app.listen() for Vercel
