const { isDevEnv } = require("./envFlag");

const allowedOrigins = [

];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin || isDevEnv) {
            callback(null, true)
        } else {
            console.log('Not allowed by CORS', origin);
            callback(true, null);
        }
    },
    credentials: true
}

module.exports = {
    corsOptions,
    allowedOrigins
};