import Service from '../models/serviceModel.js';
import Car from '../models/carModel.js';

// @desc   Create service record
// @route  POST /services
// @access Private
export const createService = async (req, res) => {
  try {
    const {
      carId,
      workDescription,
      partsUsed,
      laborCost,
      totalCost,
      status,
      notes,
    } = req.body;

    if (!carId) {
      return res.status(400).json({ message: 'carId is required' });
    }

    const car = await Car.findById(carId);
    if (!car || String(car.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const service = await Service.create({
      car: carId,
      createdBy: req.user._id,
      workDescription,
      partsUsed,
      laborCost,
      totalCost,
      status,
      notes,
    });

    res.status(201).json(service);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get all services
// @route  GET /services
// @access Private
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('car', 'plateNumber brand model');

    res.status(200).json(services);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get services for a car
// @route  GET /services/car/:carId
// @access Private
export const getServicesByCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.carId);
    if (!car || String(car.user) !== String(req.user._id)) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const services = await Service.find({
      createdBy: req.user._id,
      car: req.params.carId,
    }).sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Get single service
// @route  GET /services/:id
// @access Private
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    }).populate('car', 'plateNumber brand model');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Update service
// @route  PUT /services/:id
// @access Private
export const updateService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.workDescription = req.body.workDescription || service.workDescription;
    service.partsUsed = req.body.partsUsed || service.partsUsed;
    service.laborCost = req.body.laborCost ?? service.laborCost;
    service.totalCost = req.body.totalCost ?? service.totalCost;
    service.status = req.body.status || service.status;
    service.notes = req.body.notes || service.notes;

    const updatedService = await service.save();
    res.status(200).json(updatedService);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};

// @desc   Delete service
// @route  DELETE /services/:id
// @access Private
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service removed' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'System Error Please check the Console!' });
  }
};
