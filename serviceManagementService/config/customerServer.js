let service = require('../server/controllers/service');

let  grpc  = require('grpc');
let test = require('grpc/proto-loader')

const protoPath = require('path').join(__dirname, '../..', '/server/proto/');
console.log('////////////////////////////\n',protoPath);
const proto = grpc.load({root: protoPath, file: 'service.proto' });

const server = new grpc.Server();

server.addService(
  proto.Service.serviceManagementService.service,service);

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50054', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50054');

export default server;