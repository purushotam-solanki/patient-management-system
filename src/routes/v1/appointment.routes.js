const router = require('express').Router();

const { doctorPermissions, adminPermissions, patientPermissions } = require('@src/lib/permissions');
const controller = require('@controllers/appointment.controller');
const { authAny, validate } = require('@middlewares');
const appointmentReqValidations = require('@src/reqValidations/appointment.validations')

router.
    route('/')
    .post(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, adminPermissions.MANAGE_ALL_APPOINTMENTS),
        controller.create
    )
    .get(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, doctorPermissions.MANAGE_APPOINTMENTS_DOCTOR),
        controller.getMyAppointments
    )

router.
    route('/all')
    .get(authAny(adminPermissions.MANAGE_ALL_APPOINTMENTS), controller.getAllAppointments)

router.
    route('/:appointmentId')
    .get(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, adminPermissions.MANAGE_ALL_APPOINTMENTS, doctorPermissions.MANAGE_APPOINTMENTS_DOCTOR),
        controller.getAppointmentById
    )
    .patch(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, adminPermissions.MANAGE_ALL_APPOINTMENTS, doctorPermissions.MANAGE_APPOINTMENTS_DOCTOR),
        validate(appointmentReqValidations.updateAppointment),
        controller.updateAppointment
    )
    .delete(
        authAny(patientPermissions.MANAGE_APPOINTMENTS_PATIENT, adminPermissions.MANAGE_ALL_APPOINTMENTS),
        controller.deleteAppointmentById
    )

module.exports = router