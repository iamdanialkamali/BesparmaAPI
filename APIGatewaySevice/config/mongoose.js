import mongoose from 'mongoose';
import config from './env';
import logger from './log4js';

mongoose.Promise = global.Promise;

mongoose.connect(config.mongodb);
mongoose.connection.on('error', () => {
  logger.error(`Connected to database: ${config.mongodb}`);
  throw new Error(`unable to connect to database: ${config.mongodb}`);
});
mongoose.connection.on('connected', () => {
  logger.info(`Connected to database: ${config.mongodb}`);
});

if (config.env === 'development') {
  mongoose.set('debug', true);
} 
else if(config.env === 'test') {
  mongoose.set('test', true);
}


export default mongoose;
