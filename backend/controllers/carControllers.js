import Car from '../models/carModel.js';

// @desc   Create car
// @route  POST /cars
// @access Private
export const createCar = async (req, res) => {
    try {
        const {
            ownerName,
            phone,
            plateNumber,
            brand,
            model,
            notes,
        } = req.body;

        const carExists = await Car.findOne({ plateNumber });

        if (carExists) {
            res.status(400).json('Car already exists');
        }
        

        const car = await Car.create({
            user: req.user._id,
            ownerName,
            phone,
            plateNumber,
            brand,
            model,
            notes,
        });

        res.status(201).json(car);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })

    }

};

// @desc   Get all cars
// @route  GET /cars
// @access Private
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(cars);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })

    }

};

// @desc   Get single car
// @route  GET /cars/:id
// @access Private
export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            res.status(404);
            throw new Error('Car not found');
        }

        res.json(car)
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })

    }
    ;
};

// @desc   Update car
// @route  PUT /cars/:id
// @access Private
export const updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            res.status(404).json('Car not found');
        }

        car.ownerName = req.body.ownerName || car.ownerName;
        car.phone = req.body.phone || car.phone;
        car.plateNumber = req.body.plateNumber || car.plateNumber;
        car.brand = req.body.brand || car.brand;
        car.model = req.body.model || car.model;
        car.status = req.body.status || car.status;
        car.notes = req.body.notes || car.notes;

        const updatedCar = await car.save();
        res.status(200).json(updatedCar);
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })

    }

};

// @desc   Delete car
// @route  DELETE /cars/:id
// @access Private
export const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            res.status(404).json('Car not found');
        }

        await car.deleteOne();
        res.status(200).json({ message: 'Car removed' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "System Error Please check the Console!" })

    }

};
