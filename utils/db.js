import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let db;

async function connectToDb() {
  if (db) return db;
  const MONGO_URI = process.env.MONGO_URI;
  const client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
  await client.connect();
  db = client.db('LUMScapeDB');
  return db;
}

async function getDb() {
  if (!db) await connectToDb();
  return db;
}

export default getDb;
export { connectToDb };
