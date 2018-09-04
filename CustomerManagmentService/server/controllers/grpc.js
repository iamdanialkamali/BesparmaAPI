let customer = require('./customer');
let  grpc  = require('grpc');

try{

const protoPath = require('path').join(__dirname, '../..', '/server/proto/');
console.log('////////////////////////////\n',protoPath);
const proto = grpc.load({root: protoPath, file: 'customer.proto' });

const server = new grpc.Server();

server.addProtoService(
  proto.Customer.customerManagementService.service, 
customer);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50050');

}
catch(err){
  console.log("customerManagementServer DOWN!!!!!\n",err.message)
}
export default server;