const router = require('express').Router();

const controller = require('@controllers/auth.controller')

router
    .post('/send-otp', controller.sendOtp)

router
    .post('/verify-otp', controller.verifyOtp)

router.
    post('/log-out', controller.logOut)

module.exports = router