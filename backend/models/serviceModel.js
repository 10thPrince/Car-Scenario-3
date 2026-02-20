import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
    },
    packageSnapshot: {
      packageNumber: { type: String },
      packageName: { type: String },
      packageDescription: { type: String },
      packagePrice: { type: Number },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workDescription: {
      type: String,
      required: true,
    },
    partsUsed: {
      type: String,
    },
    laborCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);

export default Service;
