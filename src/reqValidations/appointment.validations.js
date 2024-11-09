const Joi = require('joi')

const { objectId } = require('@utils/validations');

const updateAppointment = {
    params: Joi.object().keys({
        appointmentId: Joi.string().required().custom(objectId)
    }),
    body: Joi.object().keys({
        doctor: Joi.string().required().custom(objectId),
        patient: Joi.string().required().custom(objectId),
        scheduledAt: Joi.object({
            date: Joi.date().required(),
            time: Joi.string().required()
        }).required(),
    }),
};

module.exports = {
    updateAppointment
}