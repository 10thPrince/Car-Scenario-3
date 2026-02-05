import express from 'express';
import { createCar, deleteCar, getCarById, updateCar, getCars } from '../controllers/carControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getCars);
router.post('/', protect, createCar);
router.get('/:id', protect, getCarById);
router.put('/:id', protect, updateCar);
router.delete('/:id', protect, deleteCar);

export default router