import express from 'express';
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  getPaymentsByCar,
  getPaymentsByService,
} from '../controllers/paymentControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPayment);
router.get('/', protect, getPayments);
router.get('/service/:serviceId', protect, getPaymentsByService);
router.get('/car/:carId', protect, getPaymentsByCar);
router.get('/:id', protect, getPaymentById);
router.delete('/:id', protect, deletePayment);

export default router;
