import grpc   from 'grpc'
import loader from '@grpc/proto-loader'
import path   from 'path';

import env    from './env';


const packageDefinition = loader.loadSync(path.join(__dirname, '../server/proto/customer.proto'));
const grpcPackage = grpc.loadPackageDefinition(packageDefinition);
const Client = grpcPackage.Customer.customerManagementService;
const client = new Client(env.gRPCServer, grpc.credentials.createInsecure());

export default client ;



