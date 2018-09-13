let customer = require('../server/controllers/serviceProvider');

let  grpc  = require('grpc');


const protoPath = require('path').join(__dirname, '../..', '/config/proto/');

const proto = grpc.load({root: protoPath, file: 'serviceProvider.proto' });

const server = new grpc.Server();

server.addProtoService(
  proto.serviceProvider.serviceProviderManagementService.service, 
customer);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50052', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50052');

export default server;