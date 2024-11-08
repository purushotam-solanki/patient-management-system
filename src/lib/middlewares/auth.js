const passport = require('passport');
const httpStatus = require('http-status');

const ApiError = require('@utils/ApiError');
const { roles } = require('@lib/constant');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user = {}, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  if (requiredRights.length) {
    const userRights = roles?.roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => {
  const validateTokenAndPermissions = new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })

  Promise.all([validateTokenAndPermissions])
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;