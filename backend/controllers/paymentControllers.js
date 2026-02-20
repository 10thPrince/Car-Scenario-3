import Payment from '../models/paymentModel.js';
import Service from '../models/serviceModel.js';
import Car from '../models/carModel.js';

const computePaymentStatus = (totalCost, amountPaid) => {
  const total = Number(totalCost) || 0;
  const paid = Number(amountPaid) || 0;

  if (paid <= 0) return 'unpaid';
  if (paid >= total && total > 0) return 'paid';
  return 'partial';
};

// @desc   Create payment
// @route  POST /payments
// @access Private
export const createPayment = async (req, res) => {
  try {
    const { serviceId, amount } = req.body;

    if (!serviceId) {
      return res.status(400).json({ message: 'serviceId is required' });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ message: 'amount must be greater than 0' });
    }

    const service = await Service.findOne({
      _id: serviceId,
      createdBy: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const payment = await Payment.create({
      service: service._id,
      car: service.car,
      createdBy: req.user._id,
      amount: numericAmount,
    });

    service.amountPaid = Number(service.amountPaid || 0) + numericAmount;
    service.paymentStatus = computePaymentStatus(
      service.totalCost,
      service.amountPaid
    );
    await service.save();

    res.status(201).json(payment);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get all payments
// @route  GET /payments
// @access Private
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('service', 'workDescription totalCost')
      .populate('car', 'plateNumber ownerName phone');

    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get payment by id
// @route  GET /payments/:id
// @access Private
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate('service', 'workDescription totalCost')
      .populate('car', 'plateNumber ownerName phone');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get payments by service
// @route  GET /payments/service/:serviceId
// @access Private
export const getPaymentsByService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.serviceId,
      createdBy: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const payments = await Payment.find({
      createdBy: req.user._id,
      service: req.params.serviceId,
    })
      .sort({ createdAt: -1 })
      .populate('car', 'plateNumber ownerName phone');

    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get payments by car
// @route  GET /payments/car/:carId
// @access Private
export const getPaymentsByCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);

    if (!car || String(car.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const payments = await Payment.find({
      createdBy: req.user._id,
      car: req.params.carId,
    })
      .sort({ createdAt: -1 })
      .populate('service', 'workDescription totalCost');

    res.status(200).json(payments);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Delete payment
// @route  DELETE /payments/:id
// @access Private
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    const service = await Service.findOne({
      _id: payment.service,
      createdBy: req.user._id,
    });

    if (service) {
      const newPaid = Number(service.amountPaid || 0) - Number(payment.amount || 0);
      service.amountPaid = Math.max(0, newPaid);
      service.paymentStatus = computePaymentStatus(
        service.totalCost,
        service.amountPaid
      );
      await service.save();
    }

    await payment.deleteOne();
    res.status(200).json({ message: 'Payment removed' });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: 'System Error Please check the Console!' });
  }
};
