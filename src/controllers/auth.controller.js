const httpStatus = require('http-status');
const otpGenerator = require('otp-generator')
const moment = require("moment")

const { catchAsync, generateId } = require("@src/lib/utils");
const { UserModel } = require('@src/models');
const { envConfig, cookies, logger } = require('@lib/config');
const { authTokenCookiesKeys, roles } = require('@src/lib/constant');
const { authTokenService } = require('@src/services');

const sendOtp = catchAsync(async (req, res) => {
    const filter = {
        phoneNumber: {
            countryCode: req.body.countryCode,
            number: req.body.number
        }
    }
    const user = await UserModel.findOne(filter, { phoneNumber: 1 }).lean()
    if (!user) {
        return res.status(404).json({
            message: "User not found.",
            data: null
        })
    }
    const otp = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    const otpDetails = {
        otp,
        expAt: moment().add(Number(envConfig.otpexpMinutes.login), 'minutes').unix()
    }
    logger.info(`Login OTP details: ${JSON.stringify(otpDetails)}`)
    await UserModel.updateOne({ _id: user?._id }, { $set: { otpDetails } })
    //TODO: Integration of twilio or any other third party app to send real time otp mobile number
    return res.status(200).json({
        message: "OTP sent successfully.",
        //Just for testing purpose, sending otp in reponse
        data: {
            otp
        }
    })
});

const verifyOtp = catchAsync(async (req, res) => {
    const filter = {
        phoneNumber: {
            countryCode: req.body.countryCode,
            number: req.body.number,
        },
        "otpDetails.otp": req.body.otp
    }
    const user = await UserModel.findOne(filter, { otpDetails: 0, statusHistory: 0 });
    if (!user) {
        return res.status(400).json({
            message: "Invalid OTP.",
            data: null
        })
    }
    const { role, otpDetails: { otp, expAt } = {} } = user || {}
    console.log(moment().unix())
    if (expAt <= moment().unix()) {
        return res.status(400).json({
            message: "OTP expired.",
            data: null
        })
    }
    const tokens = await authTokenService.generateAuthTokens(user)
    res.cookie(authTokenCookiesKeys.ACCESS_TOKEN, tokens?.access.token, cookies(role))
    res.cookie(authTokenCookiesKeys.REFRESH_TOKEN, tokens?.refresh.token, cookies(role))
    return res.status(200).json({
        message: "Logged In.",
        data: user
    })
})

const logOut = catchAsync(async (req, res) => {
    await authTokenService.logout(req.cookies?.rfh_tkn_pms, req.cookies?.acs_tkn_pms, req.body.userId);
    res.clearCookie(authTokenCookiesKeys.ACCESS_TOKEN)
    res.clearCookie(authTokenCookiesKeys.REFRESH_TOKEN)
    res.status(200).json({
        message: "Logged Out.",
        data: null
    });
});

const doctorSignup = catchAsync(async (req, res) => {
    const data = {
        ...req.body,
        userId: generateId("DR"),
        role: roles.DOCTOR
    };
    if (data?.email && await UserModel.isEmailTaken(data?.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken.")
    }
    if (data?.phoneNumber?.number && await UserModel.isPhoneNumberTaken(data?.phoneNumber?.number)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken.")
    }
    const doctor = await UserModel.create(data)
    /**
     * NOTE: Not setting cookies here, User will need to login through his phone number and otp.
     * this make sure that if user has entered wrong phone number then he will not be able to 
     * perform any action.
     * 
     */
    return res.status(httpStatus.OK).json({
        message: "Signed Up.",
        data: doctor
    })

})
module.exports = {
    sendOtp,
    verifyOtp,
    logOut,
    doctorSignup
}