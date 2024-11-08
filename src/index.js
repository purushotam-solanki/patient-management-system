const mongoose = require('mongoose');

const app = require('./app');
const { envConfig, logger } = require('@lib/config');

let server;
mongoose.connect(envConfig.mongoose.url).then(() => {
    logger.info('Connected to MongoDB');
    server = app.listen(envConfig.port, () => {
        logger.info(`Listening to port ${envConfig.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
