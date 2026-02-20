import Service from '../models/serviceModel.js';
import Car from '../models/carModel.js';
import Package from '../models/packageModel.js';

const computePaymentStatus = (totalCost, amountPaid) => {
  const total = Number(totalCost) || 0;
  const paid = Number(amountPaid) || 0;

  if (paid <= 0) return 'unpaid';
  if (paid >= total && total > 0) return 'paid';
  return 'partial';
};

// @desc   Create service record
// @route  POST /services
// @access Private
export const createService = async (req, res) => {
  try {
    const {
      carId,
      packageId,
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

    let selectedPackage = null;
    if (packageId) {
      selectedPackage = await Package.findOne({ _id: packageId, user: req.user._id });
      if (!selectedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
    }

    const resolvedDescription = workDescription || selectedPackage?.packageDescription || '';
    const resolvedLabor = Number(laborCost ?? selectedPackage?.packagePrice ?? 0);
    const resolvedTotal = Number(totalCost ?? resolvedLabor);

    if (!resolvedDescription) {
      return res.status(400).json({ message: 'workDescription is required' });
    }

    if (!Number.isFinite(resolvedLabor) || !Number.isFinite(resolvedTotal)) {
      return res.status(400).json({ message: 'Invalid cost values' });
    }

    const service = await Service.create({
      car: carId,
      package: selectedPackage?._id,
      packageSnapshot: selectedPackage
        ? {
            packageNumber: selectedPackage.packageNumber,
            packageName: selectedPackage.packageName,
            packageDescription: selectedPackage.packageDescription,
            packagePrice: selectedPackage.packagePrice,
          }
        : undefined,
      createdBy: req.user._id,
      workDescription: resolvedDescription,
      partsUsed,
      laborCost: resolvedLabor,
      totalCost: resolvedTotal,
      status,
      notes,
      amountPaid: 0,
      paymentStatus: computePaymentStatus(resolvedTotal, 0),
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
      .populate('car', 'plateNumber brand model ownerName phone')
      .populate('package', 'packageNumber packageName packageDescription packagePrice');

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
    })
      .populate('car', 'plateNumber brand model ownerName phone')
      .populate('package', 'packageNumber packageName packageDescription packagePrice');

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

    if (Object.prototype.hasOwnProperty.call(req.body, 'packageId')) {
      if (!req.body.packageId) {
        service.package = undefined;
        service.packageSnapshot = undefined;
      } else {
        const selectedPackage = await Package.findOne({
          _id: req.body.packageId,
          user: req.user._id,
        });
        if (!selectedPackage) {
          return res.status(404).json({ message: 'Package not found' });
        }
        service.package = selectedPackage._id;
        service.packageSnapshot = {
          packageNumber: selectedPackage.packageNumber,
          packageName: selectedPackage.packageName,
          packageDescription: selectedPackage.packageDescription,
          packagePrice: selectedPackage.packagePrice,
        };
      }
    }

    service.paymentStatus = computePaymentStatus(service.totalCost, service.amountPaid);

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
