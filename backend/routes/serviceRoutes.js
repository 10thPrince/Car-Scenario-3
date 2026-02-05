import express from 'express';
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  getServicesByCar,
  updateService,
} from '../controllers/serviceControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getServices);
router.post('/', protect, createService);
router.get('/car/:carId', protect, getServicesByCar);
router.get('/:id', protect, getServiceById);
router.put('/:id', protect, updateService);
router.delete('/:id', protect, deleteService);

export default router;
