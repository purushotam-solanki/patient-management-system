const envFlag = require("./envFlag");
const envConfig = require("./envConfig");

const cookiesOptionsForAuthTokens = {
    secure: envConfig.cookieOptions.secure,
    httpOnly: true,
    sameSite: envFlag.isDevEnv ? 'none' : 'lax',
};

const getCookieOptionsByRole = (role) => {
    const roleConfig = {
        admin: {
            accessTokenExpiration: process.env.ADMIN_JWT_ACCESS_EXPIRATION_MINUTES,
            refreshTokenExpiration: process.env.ADMIN_JWT_REFRESH_EXPIRATION_DAYS,
        },
        doctor: {
            accessTokenExpiration: process.env.DOCTOR_JWT_ACCESS_EXPIRATION_MINUTES,
            refreshTokenExpiration: process.env.DOCTOR_JWT_REFRESH_EXPIRATION_DAYS,
        },
        patient: {
            accessTokenExpiration: process.env.PATIENT_JWT_ACCESS_EXPIRATION_MINUTES,
            refreshTokenExpiration: process.env.PATIENT_JWT_REFRESH_EXPIRATION_DAYS,
        }
    };

    const config = roleConfig[role.toLowerCase()];
    if (!config) {
        throw new Error('Invalid role');
    }

    return {
        accessToken: {
            ...cookiesOptionsForAuthTokens,
            maxAge: config.accessTokenExpiration * 60 * 1000, // Convert minutes to milliseconds
        },
        refreshToken: {
            ...cookiesOptionsForAuthTokens,
            maxAge: config.refreshTokenExpiration * 24 * 60 * 60 * 1000, // Convert days to milliseconds
        }
    };
};

module.exports = getCookieOptionsByRole