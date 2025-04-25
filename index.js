import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Import routers (ES module import for compatibility)
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import eateryRoutes from './routes/eateryRoutes.js';
import officeRoutes from './routes/officeRoutes.js';
import emailRoutes from './routes/emailRoutes.js';
import authRoutes from './routes/authRoutes.js';


const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Use routers for each collection
app.use('/events', eventRoutes);
app.use('/users', userRoutes);
app.use('/locations', locationRoutes);
app.use('/eateries', eateryRoutes);
app.use('/offices', officeRoutes);
app.use('/auth', authRoutes);
app.use('/emails', emailRoutes);


app.listen(PORT);

