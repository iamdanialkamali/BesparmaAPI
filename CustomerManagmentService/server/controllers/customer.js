import Customer from '../models/customer';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import redisClient from '../../config/redis';
import tokengen from '../../config/tokengen';
import emailClient from '../../config/emailClient';




function register(call,callback){
  Customer.create({
    username: call.request.username,
    password: call.request.password,
    fullname: call.request.fullname,
    phonenumber: call.request.phonenumber,
    email: call.request.email,
    status:'pending'
  })
  .then((savedCustomer) => {
    let customerToken = generateToken(savedCustomer);
    callback(null,{
       code: 200,
       message: 'Account Created',
       userstatus: savedCustomer.status,
       token : customerToken,
    });
    let token = tokengen.generate();
  redisClient.set(token,call.request.email);

  emailClient.sendTokenEmail({
    email :call.request.email,
    token:token
  });
    
  });
}


function login (call,callback){
  Customer.findOne({
    username:call.request.username
  }).exec().then((customer)=>{
    if(!customer){
      callback('username not found',{
        code: 404 ,
        message:'username not found'
    });}
    else{
      customer.comparePassword(call.request.password,(err,isMatch)=>{
      if(err){
        callback('internal error :password matching Problem',{
          code: 500,
          message:'internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          callback(null,{
            token: generateToken(customer),
            code: 200,
            message: 'Login Successfull'
          });
        }
        else{
          callback('internal error : Incorrect Password',{
            code: 403,
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

  let token = jwt.sign(jwtPayload, secret, jwtData);
  return token;
}


function update(call,callback) {
  let token = call.request.token;
  let decoded = null;
  try{
    decoded = jwt.verify(token,config.jwtSecret);
    console.log(decoded);
    Customer.findById(decoded.id).exec().then((customer)=>{
     if(call.request.fullname!= ''){
        customer.fullname= call.request.fullname;
     }
     if(call.request.username!= ''){
       customer.username = call.request.username;

     }if(call.request.phonenumber!= ''){
        customer.phonenumber = call.request.phonenumber;
     }
      customer.save()
      .then((savedUser) =>{ 
        callback(null,{
        code: 204,
        message: 'Customer Updated',
        });
    });
    }).catch((err)=>{
      callback('Update Error',{
        code: 204,
        message: 'Update Error',
        });
    });
    
    
  }catch(err){
    callback(err.message,{
      code:500,
      message:err.message
    });
}
}


function remove(call,callback) {
  let token = call.request.token;
  try{
    let decoded = jwt.verify(token,config.jwtSecret)
  
    const customer = Customer.findById(decoded.id).exec().then((customer)=>{
    customer.status = 'deleted'

    customer.save()
      .then(() =>{ 
        callback(null,{
        code: 204,
        message: 'Customer Remove Successfully : '+ customer.username,
        });
      });
    });
  
}catch(err){  
  callback(err.message,{
    code: 500,
    message: err.message
  });}
}


function changePassword(call,callback){
  let token = call.request.token;
  
  try{

    let decoded = jwt.verify(token,config.jwtSecret);
  
  Customer.findById(decoded.id)
  .exec()
  .then((customer)=>{
    if(!customer){
      callback('Customer not found',{
        code: 404 ,
        message:'Customer not found',
    });
    
  }
    else{
      customer.comparePassword(call.request.oldpassword,(err,isMatch)=>{
      if(err){
        callback(' internal error :password matching Problem',{
          code: 500 ,
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          customer.password = call.request.newpassword;
          customer.save();
          callback(null,{
            message: 'Password Changed',
            code : 200,
          });
        }
        else{
          callback(' internal error : Incorrect Password',{
            code: 403,
            message: ' internal error : Incorrect Password'
          });
        }
      }
        
      });

    }
  }).catch((err)=>{
    callback(err.message,{
      code : 404,
      message : err.message,
    });
  });
}
catch(err)
{
  callback(err.message,{
    code: 500,
    message:err.message
  });
}
}


function forgetPassword(call,callback){
  let token = tokengen.generate();
  redisClient.set(token,call.request.email);
  emailClient.sendTokenEmail(call.request.email,token);
  callback(null,{token:token});
  
}


function resetPassword(call,callback){
  redisClient.get(call.request.token,(error, result) => {
    if (error) {
      callback( 'Not Found',{
        code: 404,
        message: 'Not Found'
      })
    }else{
      Customer.findOne({email:result})
      .exec()
      .then((customer)=>{
        customer.password = call.request.newpassword;
        customer.status='active';
        customer.save();
        callback(null,{
          code : 200 ,
          message:'Password Reseted'
        });
      }).catch((err)=>{
        callback(err.message,{
          code : 404,
          message : err.message,
        });
      });
    }
});
  
}


function verify(call,callback){
  console.log('toooooken:',call.request.token);
  redisClient.get(call.request.token,(error, result) => {
    if (error) {
      callback('Customer Not Found',{
        code: 404,
        message:'Customer Not Found'
      })
    }else{
      Customer.findOne({email:result})
      .exec()
      .then((customer)=>{
        if(customer.status=='pending'){
          customer.status='active';
          customer.save();
        }
        callback(null,{
          code : 200,
          message:'Account Activated '
        });
      }).catch((err)=>{
        callback('Not Found',{
          code : 404,
          message:'Not Found '
        });

      });
    }
});
  
}


function getMe(call,callback){
  let token = call.request.token;
  try{
    let decoded = jwt.verify(token,config.jwtSecret)
  
   Customer.findById(decoded.id).exec().then((customer)=>{

    customer.save()
      .then(() =>{ 
        callback(null,{
        code: 200,
        message: 'Customer found',
        fullname:customer.fullname,
        email: customer.email,
        phonenumber: customer.phonenumber,
        username: customer.username,
        status: customer.status,
        });
      });
    }).catch((err)=>{
      callback(err.message,{
        code : 404,
        message : err.message,
      });
    });
  
}catch(err){
  callback(err.message,{
    code: 500 ,
    message: err.message
  });}
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




export default { register, login, update, remove, changePassword,forgetPassword,resetPassword ,verify , getMe};