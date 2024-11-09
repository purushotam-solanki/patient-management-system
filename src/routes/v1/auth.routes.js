const router = require('express').Router();

const controller = require('@controllers/auth.controller');
const { validate } = require('@middlewares');
const authReqValidations = require('@src/reqValidations/auth.validations')

router
    .post('/send-otp', controller.sendOtp)

router
    .post('/verify-otp', controller.verifyOtp)

router.
    post('/log-out', controller.logOut)

router.
    post('/signup-doctor', validate(authReqValidations.doctorSignup), controller.doctorSignup)

module.exports = router