import express from 'express';
import * as emailController from '../controllers/emailController.js';
const router = express.Router();

router.post('/', emailController.processEmails);
router.get('/', emailController.getAllEvents);

export default router;
