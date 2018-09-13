import mongoose from 'mongoose';
var Float = require('mongoose-float').loadType(mongoose);
const Order = new mongoose.Schema({
  services: {
    type: [Schema.Types.ObjectId]  , 
    trim: true,
  },
  cost: { 
    type: Number, 
    required: true, 
    trim: true 
  },
  datetime: {
    type: Number , 
    required: true, 
    trim: true
  },
  provider:{
    type: Schema.Types.ObjectId , 
    trim: true,
  },
  customer:{
    type: Schema.Types.ObjectId , 
    trim: true,
  },
  status:{
    type:String,
    required: true,
  },
  rate:{
    type: Float ,
    required: false,
  },
  location:
   {type: [Number],
     index: '2d'
  }

});
Order.index({ "location": "2dsphere" });



export default mongoose.model('Order', Order);