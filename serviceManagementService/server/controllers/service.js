import Service  from  '../models/service';


function add(call,callback){
  Service.create({
    name: call.request.name,
    description: call.request.description,
    cost: call.request.cost,
    status: 'active'
  }).exec()
  .then((savedService) => {
    callback(null,{
       code: 200,
       message: 'Account Created',
       name: savedService.name,
       status : savedService.status,
    });
    
  }).catch((err)=>{
    callback('Wrong Input On Inserting In Database',{
      code: 500,
      message: 'Wrong Input On Inserting In Database',
   });
  });
}

function update(call,callback) {

  try{
  
    Service.findOne({name:call.request.name}).exec().then((service)=>{
     if(call.request.name!= ''){
        service.name= call.request.name;
     }
     if(call.request.description!= ''){
       service.description = call.request.description;

     }if(call.request.cost!= ''){
        service.cost = call.request.cost;
     }
      service.save()
      .then((savedUser) =>{ 
        callback(null,{
        code: 204,
        message: 'Service Updated',
        });
    });
    }).catch((err)=>{
      callback('Update Error',{
        code: 204,
        message: 'Update Error',
        });
    });
    
    
  }catch(err){
    callback("Internal Error",{
      code:500,
      message:"Internal Error"
    });
}
}


function remove(call,callback) {
  
  try{
    
  
    const service = Service.findOne({name:call.request.name})
    .exec()
    .then((service)=>{
    service.status = 'deleted'
    service.save()
      .then(() =>{ 
        callback(null,{
        code: 204,
        message: 'Service Remove Successfully : '+ service.description,
        });
      });
    }).catch((err)=>{
      callback("Updating Database Error",{
        code: 500,
        message: "Updating Database Error"
      });
    });
  
}catch(err){  
  callback("Internal Error",{
    code: 500,
    message: "Internal Error"
  });}
}

function get(call,callback){
  let token = call.request.token;
  try{
  
   Service.findOne({name:call.name})
   .exec()
   .then((service)=>{

    service.save()
      .then(() =>{ 
        callback(null,{
        code: 200,
        message: 'Service found',
        name:service.name,
        cost: service.cost,
        description: service.description,
        status: service.status,
        });
      });
    }).catch((err)=>{
      callback("Internal Error",{
        code : 404,
        message : "Internal Error",
      });
    });
  
}catch(err){
  callback("Internal Error",{
    code: 500 ,
    message: "Internal Error"
  });}
}




export default { add, get, update, remove };