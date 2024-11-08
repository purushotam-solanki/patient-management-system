const httpStatus = require("http-status");

const { logger } = require("../config");

/*
 Middleware to prevent slowloris attack 
by closing the request after a certain time interval whether  
it is completed or not.
Link -  https://www.cloudflare.com/learning/ddos/ddos-attack-tools/slowloris/
*/
const slowloris = (timeout) => (req, res, next) => {
    req.setTimeout(timeout, () => {
        logger.info(`Connection timed out for request from ${req.ip}`)
        res.status(httpStatus.REQUEST_TIMEOUT).send('Request Timeout');
    });

    next()
};

module.exports = slowloris