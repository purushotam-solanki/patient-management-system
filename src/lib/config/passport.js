const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const cookieExtractor = function (req) {
    let token = req.cookies || ""
    return token
}

const jwtOptions = {
    secretOrKey: "secret_key",
    jwtFromRequest: cookieExtractor
};

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== "access") {
            throw new Error('Invalid token type');
        }
        const user = {}
        if (!user) {
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
