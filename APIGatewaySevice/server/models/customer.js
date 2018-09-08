import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
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
  point:{
    type:Number,
  }

});
/*
This Method is crypting gotten password before saving
*/
CustomerSchema.pre('save', function (next) {
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

/*
This Method Comparing password in db with entered password
*/
CustomerSchema.methods.comparePassword = function (toCompare, done) {
    bcrypt.compare(toCompare, this.password, (err, isMatch) => {
      if (err) done(err);
      else done(err, isMatch);
    });

};

export default mongoose.model('Customer', CustomerSchema);