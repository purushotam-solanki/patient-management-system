const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { roles, authTokenCookiesKeys } = require('../constant');
const envConfig = require('./envConfig');
const { UserModel, AuthTokenModel } = require('@src/models');

const cookieExtractor = function (req) {
    let token = req.cookies[authTokenCookiesKeys.ACCESS_TOKEN]
    return token
}
const secretOrKeyProvider = async (request, rawJwtToken, done) => {
    try {
        // Decoding the JWT token without verifying to get the payload
        const decodedToken = request.decodedToken
        if (!decodedToken || !decodedToken.payload) {
            return done(new Error('Invalid token'));
        }

        const { role } = decodedToken.payload;
        request.jwtAccessToken = rawJwtToken;
        request.jwtAccessTokenPayload = decodedToken.payload;
        // Select the appropriate secret key based on the role
        let secretKey = "";
        switch (role) {
            case roles.ADMIN: secretKey = envConfig.jwt.adminAccessTokenSecret
                break;
            case roles.DOCTOR: secretKey = envConfig.jwt.doctorAccessTokenSecret
                break;
            case roles.PATIENT: secretKey = envConfig.jwt.patientAccessTokenSecret
                break;
        }
        if (!secretKey) {
            return done(new Error('Invalid role'));
        }

        done(null, secretKey);
    } catch (error) {
        done(error);
    }
};
const jwtOptions = {
    secretOrKeyProvider,
    jwtFromRequest: cookieExtractor,
    passReqToCallback: true,
};

const jwtVerify = async (req, payload, done) => {
    try {
        if (payload.type !== "access") {
            throw new Error('Invalid token type');
        }
        const user = await UserModel.findById(payload.sub);
        const isBlacklisted = await AuthTokenModel.findOne({ token: req.cookies[authTokenCookiesKeys.ACCESS_TOKEN], blacklisted: false }, { _id: 1 }).lean()
        if (!user || isBlacklisted) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
