const router = require('express').Router();

const { doctorPermissions, adminPermissions, patientPermissions } = require('@src/lib/permissions');
const controller = require('@controllers/appointment.controller');
const { authAny, validate } = require('@middlewares');
const appointmentReqValidations = require('@src/reqValidations/appointment.validations')

router.
    route('/')
    .post(
        // auth(doctorPermissions.MANAGE_MY_PATIENT, adminPermissions.MANAGE_ALL_PATIENT),
        controller.create
    )
    .get(controller.getMyAppointments)

router.
    route('/all')
    .get(controller.getAllAppointments)

router.
    route('/:appointmentId')
    .get(controller.getAppointmentById)
    .patch(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, adminPermissions.MANAGE_ALL_APPOINTMENTS, doctorPermissions.MANAGE_APPOINTMENTS_DOCTOR),
        validate(appointmentReqValidations.updateAppointment),
        controller.updateAppointment
    )
    .delete(controller.deleteAppointmentById)

module.exports = router