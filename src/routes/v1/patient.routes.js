const router = require('express').Router();
httpStatus = require('http-status-codes')
const { doctorPermissions, adminPermissions } = require('@src/lib/permissions');
const controller = require('@controllers/patient.controller');
const { authAny } = require('@middlewares');

router.
    route('/')
    .post(
        authAny(doctorPermissions.MANAGE_MY_PATIENT, adminPermissions.MANAGE_ALL_PATIENT),
        controller.createPatient
    )

router.
    route('/all')
    .get(authAny(adminPermissions.MANAGE_ALL_PATIENT), controller.getAllPatients)

router.
    route('/:patientId')
    .get(controller.getPatientById)

module.exports = router