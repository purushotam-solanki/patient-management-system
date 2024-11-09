const router = require('express').Router();

const { doctorPermissions, adminPermissions } = require('@src/lib/permissions');
const { authAny, validate } = require('@middlewares');
const controller = require('@controllers/patient.controller');
const patientReqValidations = require("@src/reqValidations/patient.validations")

router.
    route('/')
    .post(authAny(doctorPermissions.MANAGE_MY_PATIENT, adminPermissions.MANAGE_ALL_PATIENT), controller.createPatient)

router.
    route('/all')
    .get(authAny(adminPermissions.MANAGE_ALL_PATIENT), controller.getAllPatients)

router.
    route('/:patientId')
    .get(controller.getPatientById)
    .patch(authAny(adminPermissions.MANAGE_ALL_PATIENT), validate(patientReqValidations.updatePatient), controller.updatePatient)

module.exports = router