import express from 'express';
import crypto from 'crypto';
import getDb from '../utils/db.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const db = await getDb();
    const { email, password, scope } = req.body;
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }
    const result = await db.collection('users').insertOne({ email, password: encryptedPassword, scope });
    res.status(201).json({ message: 'User created', id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const db = await getDb();
    const { email, password } = req.body;
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await db.collection('users').findOne({ email });
    if (user && user.password === encryptedPassword) {
      res.json({ success: true, message: `${user.scope}` });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
