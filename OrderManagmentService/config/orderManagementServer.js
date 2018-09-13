let orderManangement = require('../server/controllers/orderManagement');
let  grpc  = require('grpc');

try{

const protoPath = require('path').join(__dirname, '../..', '/config/proto/');
const proto = grpc.load({root: protoPath, file: 'OrderManagement.proto' });

var server = new grpc.Server();

server.addProtoService(
  proto.OrderManagement.orderManagementService.service, 
  orderManangement);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50055', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','orderManagementServer  running on port:', '0.0.0.0:50055');

}
catch(err){
  console.log("orderManagementServer DOWN!!!!!\n",err.message)
}

export default server;