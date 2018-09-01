import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  services: [mongoose.Types.ObjectId],
  cost: { 
    type: Number, 
    required: true, 
    trim: true 
  },
  time: {
    type: String, 
    required: true, 
    trim: true
  },
  date: {
    type: String, 
    required: true, 
    trim: true  },

  providerId: mongoose.Types.ObjectId
  ,
  customerId: mongoose.Types.ObjectId
  ,
  isDeleted: {
    type: Boolean, 
    required: true, 
    trim: true
  },
  finalized: {
    type: Boolean, 
    required: true, 
    trim: true
  },
  rate: {
    type: Number, 
    required: true, 
    trim: true
  },

});

export default mongoose.model('Order', OrderSchema);