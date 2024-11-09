const router = require('express').Router();

const { doctorPermissions, adminPermissions } = require('@src/lib/permissions');
const controller = require('@controllers/appointment.controller')

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
    .delete(controller.deleteAppointmentById)

module.exports = router