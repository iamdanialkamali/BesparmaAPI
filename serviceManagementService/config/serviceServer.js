let service = require('../server/controllers/service');

let  grpc  = require('grpc');

var protoPath = require('path').join(__dirname, '../..', '/config/proto/');
console.log('////////////////////////////\n',protoPath);
const proto = grpc. grpc.loadPackageDefinition({root: protoPath, file: 'service.proto' });

const server = new grpc.Server();

server.addService(proto.Service.serviceManagementService.service,service);

server.bind('0.0.0.0:50054', grpc.ServerCredentials.createInsecure());


server.start();
console.log('','grpc server running on port:', '0.0.0.0:50054');

export default server;