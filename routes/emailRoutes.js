import express from 'express';
import * as emailController from '../controllers/emailController.js';
const router = express.Router();

router.post('/', emailController.processEmails);

export default router;
