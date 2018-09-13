import grpc   from 'grpc'
const loader = require('@grpc/proto-loader')
import path   from 'path';

import env    from './env';


const packageDefinition = loader.loadSync(path.join(__dirname, '../server/proto/serviceProvider.proto'));
const grpcPackage = grpc.loadPackageDefinition(packageDefinition);

const Client = grpcPackage.serviceProvider.serviceProviderManagementService;
const client = new Client(env.gRPCServer, grpc.credentials.createInsecure());

export default client ;



