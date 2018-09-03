let  grpc  = require('grpc');


const protoPath = require('path').join(__dirname, '../..', '/server/proto/');

const proto = grpc.load({root: protoPath, file: 'email.proto' });

const server = new grpc.Server();

server.addProtoService(
  proto.Email.emailManagementSevice.service, 
email);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50050');

export default server;