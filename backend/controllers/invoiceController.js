import Invoice from '../models/invoiceModel.js';
import InvoiceCounter from '../models/invoiceCounterModel.js';
import Service from '../models/serviceModel.js';
import Car from '../models/carModel.js';

const parseParts = (partsUsed) => {
  if (!partsUsed || typeof partsUsed !== 'string') return [];

  try {
    const parsed = JSON.parse(partsUsed);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => {
      const name = item.name || item.part || item.description || 'Part';
      const qty = Number(item.qty ?? item.quantity ?? item.count ?? 1);
      const price = Number(item.price ?? item.unitPrice ?? item.cost ?? 0);
      const safeQty = Number.isFinite(qty) ? qty : 1;
      const safePrice = Number.isFinite(price) ? price : 0;

      return {
        name,
        qty: safeQty,
        price: safePrice,
        lineTotal: safeQty * safePrice,
      };
    });
  } catch (_err) {
    return [];
  }
};

const generateInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const counter = await InvoiceCounter.findOneAndUpdate(
    { year },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.seq).padStart(6, '0');
  return `INV-${year}-${seq}`;
};

// @desc   Create invoice
// @route  POST /api/invoices
// @access Private
export const createInvoice = async (req, res) => {
  try {
    const { serviceId, notes } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId is required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.createdBy && String(service.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (service.status !== 'completed') {
      return res.status(400).json({ message: 'Service must be completed to invoice' });
    }

    const existing = await Invoice.findOne({ service: serviceId });
    if (existing) {
      return res.status(409).json({ message: 'Invoice already exists', invoiceId: existing._id });
    }

    const car = await Car.findById(service.car);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const parts = parseParts(service.partsUsed);
    const partsTotal = parts.reduce((sum, part) => sum + part.lineTotal, 0);
    const laborCost = Number(service.laborCost || 0);
    const totalCost = Number(service.totalCost || 0);
    const otherCost = Math.max(0, totalCost - laborCost - partsTotal);

    let invoiceNumber = await generateInvoiceNumber();

    let invoice;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        invoice = await Invoice.create({
          user: req.user._id,
          invoiceNumber,
          service: service._id,
          car: car._id,
          customerSnapshot: {
            ownerName: car.ownerName,
            phone: car.phone,
            plateNumber: car.plateNumber,
            brand: car.brand,
            model: car.model,
            year: car.year || '',
            color: car.color || '',
          },
          serviceSnapshot: {
            problem: service.workDescription,
            workDone: service.notes,
            parts,
            laborCost,
            otherCost,
            totalCost,
            status: service.status,
          },
          paymentSnapshot: {
            amountPaid: Number(service.amountPaid || 0),
            paymentStatus: service.paymentStatus || 'unpaid',
          },
          notes,
        });
        break;
      } catch (err) {
        if (err?.code === 11000) {
          invoiceNumber = await generateInvoiceNumber();
          continue;
        }
        throw err;
      }
    }

    if (!invoice) {
      return res.status(500).json({ message: 'Failed to create invoice' });
    }

    res.status(201).json(invoice);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get all invoices
// @route  GET /api/invoices
// @access Private
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({ issuedAt: -1 })
      .select('invoiceNumber issuedAt serviceSnapshot.totalCost paymentSnapshot.paymentStatus customerSnapshot.plateNumber');

    res.status(200).json(invoices);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get invoice by id
// @route  GET /api/invoices/:id
// @access Private
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get invoice by service
// @route  GET /api/invoices/service/:serviceId
// @access Private
export const getInvoiceByService = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      service: req.params.serviceId,
      user: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};
