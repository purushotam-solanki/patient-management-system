const moment = require("moment")
const jwt = require("jsonwebtoken")

const { AuthTokenModel } = require("@src/models");
const { roles, authTokenTypes } = require("@lib/constant");
const { envConfig } = require("@lib/config");

const generateAuthTokens = async (user) => {
    const { role = "" } = user || {};
    let accessTokenExpires = "";
    let accessToken = "";
    let refreshTokenExpires = "";
    let refreshToken = "";

    switch (role) {
        case roles.ADMIN:
            accessTokenExpires = moment().add(envConfig.jwt.adminAccessExpirationMinutes, 'minutes');
            accessToken = generateToken(user._id, accessTokenExpires, authTokenTypes.ACCESS, roles.ADMIN);

            refreshTokenExpires = moment().add(envConfig.jwt.adminRefreshExpirationDays, 'days');
            refreshToken = generateToken(user._id, refreshTokenExpires, authTokenTypes.REFRESH, roles.ADMIN);
            break;
        case roles.DOCTOR:
            accessTokenExpires = moment().add(envConfig.jwt.doctorAccessExpirationMinutes, 'minutes');
            accessToken = generateToken(user._id, accessTokenExpires, authTokenTypes.ACCESS, roles.DOCTOR);

            refreshTokenExpires = moment().add(envConfig.jwt.trainerRefreshExpirationDays, 'days');
            refreshToken = generateToken(user._id, refreshTokenExpires, authTokenTypes.REFRESH, roles.DOCTOR);
            break;
        case roles.PATIENT:
            accessTokenExpires = moment().add(envConfig.jwt.patientAccessExpirationMinutes, 'minutes');
            accessToken = generateToken(user._id, accessTokenExpires, authTokenTypes.ACCESS, roles.PATIENT);

            refreshTokenExpires = moment().add(envConfig.jwt.patientRefreshExpirationDays, 'days');
            refreshToken = generateToken(user._id, refreshTokenExpires, authTokenTypes.REFRESH, roles.PATIENT);
            break;
    }
    //Storing the token into db
    await saveToken(refreshToken, user._id, refreshTokenExpires, authTokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};

const generateToken = (userId, expires, type, role) => {
    switch (type) {
        case authTokenTypes.ACCESS:
            secret = envConfig.jwt[`${role}AccessTokenSecret`];
            break;
        case authTokenTypes.REFRESH:
            secret = envConfig.jwt[`${role}RefreshTokenSecret`];
            break;
    }

    let payload = {
        sub: userId,
        iat: moment().unix(),
        exp: expires.unix(),
        type,
        role,
    };
    return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await AuthTokenModel.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};

const logout = async (refreshToken, accessToken) => {
    //Deleting the refresh token
    await AuthTokenModel.findOneAndDelete({ token: refreshToken, type: authTokenTypes.REFRESH });
    //Marking the access the token as blacklisted
    await AuthTokenModel.updateOne({ token: accessToken, type: authTokenTypes.ACCESS }, { $set: { blacklisted: true } })
};

module.exports = {
    generateAuthTokens,
    generateToken,
    saveToken,
    logout
}