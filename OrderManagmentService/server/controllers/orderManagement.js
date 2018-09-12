import Order from '../models/order';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import redisClient from '../../config/redis';
import tokengen from '../../config/tokengen';
import emailClient from '../../config/emailClient';
import moment from 'moment';
import "google/protobuf/struct.proto";




function addOrder(call,callback){
  Order.create({
    services: call.request.servicesI, 
    cost: call.request.cost,
    datetime: moment(call.request.datetime) ,
    provider: call.request.providerId,
    customer: call.request.customerId,
    status: 'pending',
    rate: null ,
    location: call.request.location,
  })
  .then((order) => {
    callback(null,{
       code: 200,
       message: 'Order Created',
    });
    
  
  }).catch((err)=>{
    callback(null,{
      code: 503,
      message: 'Wrong Input',
      userstatus: savedorder.status,
      token : orderToken,
   });
  });
}


function login (call,callback){
  Order.findOne({
    username:call.request.username
  }).exec().then((order)=>{
    if(!order){
      callback('username not found',{
        code: 404 ,
        message:'username not found'
    });}
    else{
      order.comparePassword(call.request.password,(err,isMatch)=>{
      if(err){
        callback('internal error :password matching Problem',{
          code: 500,
          message:'internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          callback(null,{
            token: generateToken(order),
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
  

function generateToken(order) {
  
  const jwtPayload = {
    id: order._id
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
    Order.findById(decoded.id).exec().then((order)=>{
     if(call.request.fullname!= ''){
        order.fullname= call.request.fullname;
     }
     if(call.request.username!= ''){
       order.username = call.request.username;

     }if(call.request.phonenumber!= ''){
        order.phonenumber = call.request.phonenumber;
     }
      order.save()
      .then((savedUser) =>{ 
        callback(null,{
        code: 204,
        message: 'Order Updated',
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
  
    const order = Order.findById(decoded.id).exec().then((order)=>{
    order.status = 'deleted'

    order.save()
      .then(() =>{ 
        callback(null,{
        code: 204,
        message: 'order Remove Successfully : '+ order.username,
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
  
  Order.findById(decoded.id)
  .exec()
  .then((order)=>{
    if(!order){
      callback('Order not found',{
        code: 404 ,
        message:'Order not found',
    });
    
  }
    else{
      order.comparePassword(call.request.oldpassword,(err,isMatch)=>{
      if(err){
        callback(' internal error :password matching Problem',{
          code: 500 ,
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          order.password = call.request.newpassword;
          order.save();
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
      Order.findOne({email:result})
      .exec()
      .then((order)=>{
        order.password = call.request.newpassword;
        order.status='active';
        order.save();
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
      Order.findOne({id:call.request.id})
      .exec()
      .then((order)=>{
        if(order.status=='pending'){
          order.status='active';
          order.save();
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


function getMe(call,callback){
  let token = call.request.token;
  try{
    let decoded = jwt.verify(token,config.jwtSecret)
  
   Order.findById(decoded.id).exec().then((order)=>{

    order.save()
      .then(() =>{ 
        callback(null,{
        code: 200,
        message: 'Order found',
        fullname:order.fullname,
        email: order.email,
        phonenumber: order.phonenumber,
        username: order.username,
        status: order.status,
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

function getSuggestedSP(call,callback){
  let location = call.request.location;
  Order.aggregate(
    [
        { "$geoNear": {
            "location": {
                "type": "Point",
                "coordinates": location
            },
            "distanceField": "distance",
            "spherical": true,
            "maxDistance": 1000
        }}
    ],
  ).then((e)=>{
    callback(null,{
      code: 200,
      message :"Request Sent",
    });
    callback(e);
  });
  
}
/*
function list(call,callback) {
  const { limit = 50, skip = 0 } = req.c;
  order.find()
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




export default { register, login, update, remove, changePassword,forgetPassword,resetPassword ,verify , getMe , getSuggestedSP};