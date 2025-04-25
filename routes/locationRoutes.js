import express from 'express';
const router = express.Router();
import * as locationController from '../controllers/locationController.js';

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.updateLocation);
router.delete('/:id', locationController.deleteLocation);

export default router;
