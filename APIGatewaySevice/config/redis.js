import redis from 'redis';
import config from './env';
import logger from './log4js';

const redis_client = redis.createClient({host: config.redisHost, port: config.redisPort});

redis_client.on('ready', () => {
    logger.info("Redis is ready");
});

redis_client.on('error', () => {
    logger.error("Error in Redis");
});


export default redis_client;