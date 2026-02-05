import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    plateNumber: {
      type: String,
      required: true,
      unique: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },


    status: {
      type: String,
      enum: ['pending', 'servicing', 'completed'],
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

const Car = mongoose.model('Car', carSchema);

export default Car;