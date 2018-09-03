let  grpc  = require('grpc');
let email = require('../server/controllers/mail')

const protoPath = require('path').join(__dirname, '../..', '/server/proto/');

const proto = grpc.load({root: protoPath, file: 'email.proto' });

const server = new grpc.Server();

server.addProtoService(
  proto.Email.emailManagementService.service, 
email);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50051');

export default server;