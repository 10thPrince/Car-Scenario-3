import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      unique: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    customerSnapshot: {
      ownerName: { type: String },
      phone: { type: String },
      plateNumber: { type: String },
      brand: { type: String },
      model: { type: String },
      year: { type: String },
      color: { type: String },
    },
    serviceSnapshot: {
      problem: { type: String },
      workDone: { type: String },
      parts: [
        {
          name: { type: String },
          qty: { type: Number },
          price: { type: Number },
          lineTotal: { type: Number },
        },
      ],
      laborCost: { type: Number },
      otherCost: { type: Number },
      totalCost: { type: Number },
      status: { type: String },
    },
    paymentSnapshot: {
      amountPaid: { type: Number },
      paymentStatus: { type: String },
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
