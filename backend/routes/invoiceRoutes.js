import express from 'express';
import {
  createInvoice,
  getInvoiceById,
  getInvoiceByService,
  getInvoices,
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createInvoice);
router.get('/', protect, getInvoices);
router.get('/service/:serviceId', protect, getInvoiceByService);
router.get('/:id', protect, getInvoiceById);

export default router;
