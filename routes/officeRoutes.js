import express from 'express';
const router = express.Router();
import * as officeController from '../controllers/officeController.js';

router.get('/', officeController.getAllOffices);
router.post('/', officeController.createOffice);
router.get('/:id', officeController.getOfficeById);
router.put('/:id', officeController.updateOffice);
router.delete('/:id', officeController.deleteOffice);

export default router;
