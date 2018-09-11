const grpc = require('grpc');

try{

const protoPath = require('path').join(__dirname, '', 'proto');


const proto = grpc.load({root: protoPath, file: 'email.proto' });
console.log("/////////////////////////\n",protoPath);
//Create a new client instance that binds to the IP and port of the grpc server.
var client = new proto.Email.emailManagementService('localhost:50051', grpc.credentials.createInsecure());

}
catch(err){
    console.log("Customer EmailClient DOWN!!!!!!!\n",err.message);
}


//Create a new client instance that binds to the IP and port of the grpc server.
export default client;