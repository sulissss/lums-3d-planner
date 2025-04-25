import express from 'express';
const router = express.Router();
import * as eateryController from '../controllers/eateryController.js';

router.get('/', eateryController.getAllEateries);
router.post('/', eateryController.createEatery);
router.get('/:id', eateryController.getEateryById);
router.put('/:id', eateryController.updateEatery);
router.delete('/:id', eateryController.deleteEatery);

export default router;
