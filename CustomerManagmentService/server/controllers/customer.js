import Customer from '../models/customer';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import client from '../../redis;'
import tokengen from '../../config/tokengen'






function get(req, res) {
  return res.json(req.dbUser);
}

function register(call,callback){
  Customer.create({
    username: call.username,
    password: call.body.password,
    fullname: call.fullname,
    phonenumber:call.phonenumber,
    status:'pending'
  })
  .then((savedCustomer) => {
    callback(savedCustomer)
  });
}
function login (call,callback){
  Customer.findOne({
    username:call.username,
  }).exec().then((customer)=>{
    if(!customer){
      callback({
        status:'404',
        message:'username not found'
    })}
    else{
      customer.comparePassword(call.password,(err,isMatch)=>{
      if(err){
        callback({
          status:'500',
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          callback({
            token: generateToken(customer),
            status: '200',
          });
        }
        else{
          callback({
            status:'403',
            message:' internal error : Incorrect Password'
          });
        }
      }
        
      })

    }
  });

}

function generateToken(customer) {
  
  const jwtPayload = {
    id: customer._id
  };
  const jwtData = {
    expiresIn: config.jwtDuration,
  };
  const secret = config.jwtSecret;
  token = jwt.sign(jwtPayload, secret, jwtData);
  return token
}


function update(call,callback) {
  let token = call.token;
  
  try{
    let decoded = jwt.verify(token,config.jwtSecret)
  }catch(err){
    callback({
      status:'500',
      message:err.message
    });
  }
  const customer = Customer.findById(decoded.id)
  Object.assign(customer, call);

  customer.save()
    .then((savedUser) =>{ 
      callback({
      status: '204',
      message: 'ok',
      });
  });
}

function remove(call,callback) {
  let token = call.token;
  try{
    let decoded = jwt.verify(token,config.jwtSecret)
  }catch(err){
    callback({
      status:'500',
      message:err.message
    });
  }
  const customer = Customer.findById(decoded.id)
  Object.assign(customer, {status:'deleted'});

  customer.save()
    .then(() =>{ 
      callback({
      status: '204',
      message: 'ok',
      });
  });
  
}

function changePassword(call,callback){
  let token = call.token;
  
  try{

    let decoded = jwt.verify(token,config.jwtSecret);
  }
  catch(err)
  {
    callback({
      status:'500',
      message:err.message
    });
  }
  Customer.findById(decoded.id)
  .exec()
  .then((customer)=>{
    if(!customer){
      callback({
        status:'404',
        message:'user not found',
    });
  }
    else{
      customer.comparePassword(call.oldPassword,(err,isMatch)=>{
      if(err){
        callback({
          status:'500',
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          customer.password = call.newPassword;
          customer.save();
          callback({
            message:'Password Changed',
            status: '200',
          });
        }
        else{
          callback({
            status:'403',
            message:' internal error : Incorrect Password'
          });
        }
      }
        
      });

    }
  });
}

function forgetPassword(call,callback){
  let token = tokengen.generate();
  client.set(token,call.email);
  
}


function resetPassword(call,callback){
  client.get(call.token,(error, result) => {
    if (error) {
      callback({
        status:'404',
        message:'Not Found'
      })
    }else{
      Customer.findOne({email:result})
      .exec()
      .then((customer)=>{
        customer.status='active';
        customer.save();
        callback({
          status:'200',
          message:'Password Reseted '
        })
      });
    }
});
  
}


/*
function list(call,callback) {
  const { limit = 50, skip = 0 } = req.c;
  Customer.find()
    .skip(skip)
    .limit(limit)
    .exec()
    .then((users) => res.json(users),
      (e) => next(e));
}

function remove(req, res, next) {
  const user = req.dbUser;
  user.remov
    .then(() => res.sendStatus(204),
      (e) => next(e));
}
*/





export default { register, login, update, remove, changePassword,forgetPassword,resetPassword };