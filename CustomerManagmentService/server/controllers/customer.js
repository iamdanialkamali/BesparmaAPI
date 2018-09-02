import Customer from '../models/customer';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import client from '../../config/redis';
import tokengen from '../../config/tokengen';




function register(call,callback){
  console.log(call);
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
       fullname: savedCustomer.fullname,
       email :savedCustomer.email,
       phonenumber: savedCustomer.phonenumber,
       username :savedCustomer.username,
       status: savedCustomer.status,
       token : customerToken,
    });
    
  });
}
function login (call,callback){
  Customer.findOne({
    username:call.request.username
  }).exec().then((customer)=>{
    if(!customer){
      callback('username not found',{
        status:'404',
        message:'username not found'
    })}
    else{
      customer.comparePassword(call.request.password,(err,isMatch)=>{
      if(err){
        callback('internal error :password matching Problem',{
          status:'500',
          message:'internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          callback(null,{
            token: generateToken(customer),
            status: '200',
          });
        }
        else{
          callback(' internal error : Incorrect Password',{
            status:'403',
            message:' internal error : Incorrect Password'
          });

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
          
          
          
          
          export default { register, login, update, remove, changePassword,forgetPassword,resetPassword ,verify};
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
        status: '204',
        message: 'ok',
        });
    });
    });
    
    
  }catch(err){
    callback({
      status:'500',
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
        status: '204',
        message: 'ok',
        });
      });
    });
  
}catch(err){
  callback({
    status:'500',
    message:err.message
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
      callback({
        status:'404',
        message:'user not found',
    });
    
  }
    else{
      customer.comparePassword(call.request.oldPassword,(err,isMatch)=>{
      if(err){
        callback({
          status:'500',
          message:' internal error :password matching Problem'
        });
      }else{
        if(isMatch){
          customer.password = call.request.newPassword;
          customer.save();
          callback(null,{
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
catch(err)
{
  callback({
    status:'500',
    message:err.message
  });
}
}

function forgetPassword(call,callback){
  let token = tokengen.generate();
  client.set(token,call.request.email);
  callback(null,token);
  
}

function resetPassword(call,callback){
  client.get(call.request.token,(error, result) => {
    if (error) {
      callback({
        status:'404',
        message:'Not Found'
      })
    }else{
      Customer.findOne({email:result})
      .exec()
      .then((customer)=>{
        customer.password = call.request.newPassword;
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
function verify(call,callback){
  client.get(call.request.token,(error, result) => {
    if (error) {
      callback({
        status:'404',
        message:'Not Found'
      })
    }else{
      Customer.findOne({email:result})
      .exec()
      .then((customer)=>{
        if(customer.status=='pending'){
          customer.status='active';
          customer.save();
        }
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




export default { register, login, update, remove, changePassword,forgetPassword,resetPassword ,verify};