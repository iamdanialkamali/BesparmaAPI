let customer = require('../server/controllers/customer');

let  grpc  = require('grpc');

try{
const protoPath = require('path').join(__dirname, '../..', '/config/proto/');
console.log('////////////////////////////\n',protoPath);
const proto = grpc.loadPackageDefinition({root: protoPath, file: 'customer.proto' });

var server = new grpc.Server();

server.addProtoService(
  proto.Customer.customerManagementService.service, 
customer);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','Customer server running on port:', '0.0.0.0:50050');
}
catch(err){
  console.log('','Customer server Down on on port:', '0.0.0.0:50050');
}
export default server;