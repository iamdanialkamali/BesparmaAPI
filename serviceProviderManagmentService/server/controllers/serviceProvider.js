import ServiceProvider from '../models/serviceProvider';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import redisClient from '../../config/redis';
import tokengen from '../../config/tokengen';
import emailClient from '../../config/emailClient';




function register(call,callback){
  ServiceProvider.create({
    username:   call.request.username,
    password:   call.request.password,
    fullname: call.request.fullname,
    phonenumber: call.request.phonenumber,
    email: call.request.email,
    status: 'pending',
    degree: call.request.degree,
    nationalcode: call.request.nationalCode,
    marrige: call.request.marrige,
    age: call.request.age,
    homephonenumber: call.request.homephonenumber


  })
  .then((savedServiceProvider) => {
    let ServiceProviderToken = generateToken(savedServiceProvider);
    callback(null,{
       code: 200,
       message: 'Account Created',
       userstatus: savedServiceProvider.status,
       token : ServiceProviderToken,
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
  ServiceProvider.findOne({
    username:call.request.username
  }).exec().then((serviceProvider)=>{
    if(!serviceProvider){
      callback('username not found',{
        code: 404 ,
        message:'username not found'
    });}
    else{
      serviceProvider.comparePassword(call.request.password,(err,isMatch)=>{
      if(err){
        callback('internal error :password matching Problem',{
          code: 500,
          message:'internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          callback(null,{
            token: generateToken(serviceProvider),
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
  

function generateToken(serviceProvider) {
  
  const jwtPayload = {
    id: serviceProvider._id
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
    ServiceProvider.findById(decoded.id).exec().then((serviceProvider)=>{
     if(call.request.fullname!= ''){
        serviceProvider.fullname= call.request.fullname;
     }
     if(call.request.username!= ''){
       serviceProvider.username = call.request.username;

     }if(call.request.phonenumber!= ''){
        serviceProvider.phonenumber = call.request.phonenumber;
     }
      serviceProvider.save()
      .then((savedUser) =>{ 
        callback(null,{
        code: 204,
        message: 'ServiceProvider Updated',
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
  
    const serviceProvider = ServiceProvider.findById(decoded.id).exec().then((serviceProvider)=>{
    serviceProvider.status = 'deleted'

    serviceProvider.save()
      .then(() =>{ 
        callback(null,{
        code: 204,
        message: 'serviceProvider Remove Successfully : '+ serviceProvider.username,
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
  
  ServiceProvider.findById(decoded.id)
  .exec()
  .then((serviceProvider)=>{
    if(!serviceProvider){
      callback('ServiceProvider not found',{
        code: 404 ,
        message:'ServiceProvider not found',
    });
    
  }
    else{
      serviceProvider.comparePassword(call.request.oldpassword,(err,isMatch)=>{
      if(err){
        callback(' internal error :password matching Problem',{
          code: 500 ,
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          serviceProvider.password = call.request.newpassword;
          serviceProvider.save();
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
      ServiceProvider.findOne({email:result})
      .exec()
      .then((serviceProvider)=>{
        serviceProvider.password = call.request.newpassword;
        serviceProvider.status='active';
        serviceProvider.save();
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
      ServiceProvider.findOne({id:call.request.id})
      .exec()
      .then((serviceProvider)=>{
        if(serviceProvider.status=='pending'){
          serviceProvider.status='active';
          serviceProvider.save();
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
  
   ServiceProvider.findById(decoded.id).exec().then((serviceProvider)=>{

    serviceProvider.save()
      .then(() =>{ 
        callback(null,{
        code: 200,
        message: 'ServiceProvider found',
        fullname:serviceProvider.fullname,
        email: serviceProvider.email,
        phonenumber: serviceProvider.phonenumber,
        username: serviceProvider.username,
        status: serviceProvider.status,
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
  ServiceProvider.aggregate(
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
  serviceProvider.find()
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