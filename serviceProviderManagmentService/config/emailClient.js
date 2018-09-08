const grpc = require('grpc');


const protoPath = require('path').join(__dirname, '', 'proto');

const proto = grpc.load({root: protoPath, file: 'email.proto' });
//Create a new client instance that binds to the IP and port of the grpc server.
let  emailClient = new proto.Email.emailManagementService('localhost:50051', grpc.credentials.createInsecure());

console.log('email path:',protoPath);


//Create a new client instance that binds to the IP and port of the grpc server.
export default emailClient;