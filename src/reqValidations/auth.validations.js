const Joi = require('joi')

const { phoneNumber } = require('@utils/validations');

const doctorSignup = {
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().email(),
        phoneNumber: Joi.object().required().keys({
            countryCode: Joi.string().required(),
            number: Joi.string().required()
        }).custom(phoneNumber),
        profilePic: Joi.string().allow(""),
    }),
};

module.exports = {
    doctorSignup
}