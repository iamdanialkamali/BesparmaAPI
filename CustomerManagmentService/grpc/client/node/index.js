const grpc = require('grpc');

const protoPath = require('path').join(__dirname, '../..', 'proto');
const proto = grpc.load({root: protoPath, file: 'work_leave.proto' });

//Create a new client instance that binds to the IP and port of the grpc server.
const client = new proto.work_leave.EmployeeLeaveDaysService('localhost:50050', grpc.credentials.createInsecure());

const User = {
  ali :{
    id: 1,
    name: 'John Kariuki',
    age: 10
  },
  naghi :{
    id: 1,
    name: 'John Kariuki',
    age: 23
  },
  asad:{
    id: 1,
    name: 'John Kariuki',
    age: 19,
  },
 
}

client.eligible(User.ali, (error, response) => {
  if (!error) {
    if (response.eligible) {
      
        console.log(response);
      }
      else {
        console.log("You are currently ineligible for leave days");}
        
    } else {
      console.log("You are currently ineligible for leave days");
    }
 
  });
