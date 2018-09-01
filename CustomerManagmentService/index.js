import app from './config/express';
import logger from './config/log4js';
import redis from './config/redis';
import config from './config/env';
import mongoose from './config/mongoose';
import grpc from './server/controllers/grpc';

app.listen(config.NODE_PORT, () => {
    logger.info(`API Server started and listening on port ${config.NODE_PORT}`);
});

export default app;
