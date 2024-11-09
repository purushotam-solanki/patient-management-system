const passport = require('passport');
const httpStatus = require('http-status');

const ApiError = require('@utils/ApiError');
const { roles, userStatus } = require('@lib/constant');
const { adminPermissions, doctorPermissions, patientPermissions } = require('../permissions');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user = {}, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;
  const { role, status } = user || {}
  if (status !== userStatus.ACTIVE) {
    return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  if (requiredRights.length) {
    let userRights = null;
    if (role == roles.ADMIN) {
      userRights = Object.values(adminPermissions)
    } else if (role == roles.DOCTOR) {
      userRights = Object.values(doctorPermissions)
    } else {
      userRights = Object.values(patientPermissions)
    }
    const hasRequiredRights = requiredRights.some((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  resolve();
};

const authAny = (...requiredRights) => async (req, res, next) => {
  const validateTokenAndPermissions = new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })

  Promise.all([validateTokenAndPermissions])
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = authAny;