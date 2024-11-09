require('./moduleAlias');

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

const { envFlag, cors: { corsOptions }, passport: { jwtStrategy } } = require('@lib/config');
const { error: { errorConverter, errorHandler }, slowloris } = require('@lib/middlewares');
const { ApiError } = require('@utils');
const routes = require('./routes/v1');
const { authTokenTypes, authTokenCookiesKeys } = require('./lib/constant');

const app = express();

app.use(cookieParser())
// set security HTTP headers
app.use(helmet());


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// Enable CORS 
app.use(cors(corsOptions));

// Decoding the JWT token without verifying to get the payload
app.use((req, res, next) => {
    const rawJwtToken = req.cookies[authTokenCookiesKeys.ACCESS_TOKEN]
    req.decodedToken = jwt.decode(rawJwtToken, { complete: true });
    next()
});

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

/*
Slowloris attack prevention middleware.
slowloris(7000), 7000ms is timeout after which request 
will be closed automatically.
**/
if (envFlag.isProduction) {
    app.use(slowloris(7000))
}

//End point to check server health
app.get("/api", (req, res) => {
    res.send("EndPoints are ready to Serve!!")
})

app.use("/api/v1", routes)
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    console.log(`404-${req.originalUrl}`)
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
