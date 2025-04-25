import express from 'express';
import crypto from 'crypto';
import getDb from '../utils/db.js';
import * as userController from '../controllers/userController.js';
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const db = getDb();
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

// Login
router.post('/login', async (req, res) => {
  try {
    const db = getDb();
    const { email, password } = req.body;
    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await db.collection('users').findOne({ email });
    if (user && user.password === encryptedPassword) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
