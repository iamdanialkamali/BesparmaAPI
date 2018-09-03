const grpc = require('grpc');



const protoPath = require('path').join(__dirname, '../..', '/server/proto/');
const proto = grpc.load({root: protoPath, file: 'email.proto' });

//Create a new client instance that binds to the IP and port of the grpc server.
const client = new proto.Email.emailManagementService('localhost:50051', grpc.credentials.createInsecure());


export default client;