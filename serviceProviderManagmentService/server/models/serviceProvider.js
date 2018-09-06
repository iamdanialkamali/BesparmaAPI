import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const ServiceProviderSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true, 
    trim: true,
    unique:true,
  },
  password: { 
    type: String, 
    required: true, 
    trim: true 
  },
  fullname:{
    type: String, 
    required: true, 
    trim: true
  },
  email:{
    type: String, 
    required: true, 
    trim: true,
    unique: true,
  },
  phonenumber:{
    type: String, 
    required: true, 
    trim: true
  },
  status:{
    type:String,
    required: true,
  },
  degree:{
    type:String,
    required: true,
  },
  nationalcode:{
    type:String,
    required: true,
  },
  marrige:{
    type:String,
    required: true,
  },
  address:{
    type:String,
    required: true,
  },
  age:{
    type:Number,
    required: true,
  },
  status:{
    type:String,
    required: true,
  },
  homephonenumber:{
    type:String,
    required: true,
  }, 
  point:{
    type:Number,
  },
  location:
   {type: [Number],
     index: '2d'
  }

});
ServiceProviderSchema.index({ "location": "2dsphere" });

/*
This Method is crypting gotten password before saving
*/
ServiceProviderSchema.pre('save', function (next) {
    const customer = this;
  
    if (!customer.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(customer.password, salt, (hashErr, hash) => {
        if (hashErr) return next(hashErr);  
        customer.password = hash;
        next();
      });
    });
  });
ServiceProviderSchema.methods.findNear = function(cb) {
    return this.model('ServiceProvider').find({location: { $nearSphere: this.location, $maxDistance: 0.01} }, cb);
  }
/*
This Method Comparing password in db with entered password
*/
ServiceProviderSchema.methods.comparePassword = function (toCompare, done) {
    bcrypt.compare(toCompare, this.password, (err, isMatch) => {
      if (err) done(err);
      else done(err, isMatch);
    });

};

export default mongoose.model('ServiceProvider', ServiceProviderSchema);