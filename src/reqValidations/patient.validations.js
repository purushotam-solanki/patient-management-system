const validator = require('validator')
const Joi = require('joi')

const { userStatus } = require("@lib/constant");
const { objectId } = require('@utils/validations');

const updatePatient = {
    params: Joi.object().keys({
        patientId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        fullName: Joi.string().required(),
        status: Joi.string().required().valid(...Object.values(userStatus)),
        profilePic: Joi.string().allow(""),
    }),
};

module.exports = {
    updatePatient
}