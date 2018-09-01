import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import float from 'mongoose-float';


let floatType = float.loadType(mongoose);

const UserSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true, 
    trim: true
  },
  password: { 
    type: String, 
    required: true, 
    trim: true 
  },
  firstname: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastname: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    trim: true 
  },
  phonenumber: { 
    type: String, 
    required: true, 
    trim: true 
  },
  verified: { 
    type: Boolean, 
    required: true, 
    trim: true 
  },
  degree: { 
    type: String, 
    required: true, 
    trim: true 
  },
  nationalcode: { 
    type: String, 
    required: true, 
    trim: true 
  },
  marrige: { 
    type: Boolean, 
    required: true, 
    trim: true 
  },
  address: { 
    type: String, 
    required: true, 
    trim: true 
  },
  age: { 
    type: Number, 
    required: true, 
    trim: true 
  },
  homephonenumber: { 
    type: String, 
    required: true, 
    trim: true 
  },
  isdeleted: { 
    type: boolean, 
    required: true, 
    trim: true 
  },
  rating: { 
    type: floatType, 
    required: true, 
    trim: true 
  },
});

UserSchema.pre('save', function (next) {
    const user = this;
  
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
        if (hashErr) return next(hashErr);  
        user.password = hash;
        next();
      });
    });
  });

UserSchema.methods.comparePassword = function (toCompare, done) {
    bcrypt.compare(toCompare, this.password, (err, isMatch) => {
      if (err) done(err);
      else done(err, isMatch);
    });
};

export default mongoose.model('User', UserSchema);