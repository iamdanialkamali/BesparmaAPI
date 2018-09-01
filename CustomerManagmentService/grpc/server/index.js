const grpc = require('grpc');

const proto = grpc.load('proto/work_leave.proto');
const server = new grpc.Server();

//define the callable methods that correspond to the methods defined in the protofile
server.addProtoService(proto.work_leave.EmployeeLeaveDaysService.service, {
  /**
  Check if an employee is eligible for leave.
  True If the requested leave days are greater than 0 and within the number
  of accrued days.
  */
  eligible(call, callback) {
    if (call.request.age > 18) {
     
        callback(null, { eligible: true });
      } else {
        callback(null, { eligible: false });
      }
    
    },

  
});

//Specify the IP and and port to start the grpc Server, no SSL in test environment
server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server running on port:', '0.0.0.0:50050');