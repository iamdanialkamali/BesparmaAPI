import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true, 
    trim: true,
    unique:true,
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  cost:{
    type: Number, 
    required: true, 
    trim: true,
  },
  status:{
    type: String, 
    required: true, 
    trim: true
  }

});


export default mongoose.model('Service', ServiceSchema);