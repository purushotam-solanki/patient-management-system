const httpStatus = require('http-status')

const { catchAsync, generateId, pick } = require("@lib/utils");
const { roles } = require('@src/lib/constant');
const patientService = require('@src/services/patient.service');

const createPatient = catchAsync(async (req, res, next) => {
    const patientDetails = {
        ...req.body,
        createdBy: req.user?._id,
        role: roles.PATIENT,
        userId: generateId("PA")
    }

    const patient = await patientService.createPatient(patientDetails);
    return res.status(200).json({
        message: "sucesss",
        data: patient
    });
});

const getDoctorPatients = catchAsync(async (req, res) => {
    const doctor = req.user;
    const patients = await patientService.getDoctorPatients(doctor)

})

const getAllPatients = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page']);
    const filter = pick(req.query, ['search']);
    const patients = await patientService.getAllPatients(filter, options);
    return res.status(200).json({
        message: "success",
        data: patients
    })
})

const getPatientById = catchAsync(async (req, res) => {
    const patient = await patientService.getPatientById(req.params.patientId);
    if (!patient) {
        return res.status(404).json({
            message: "Appointment not found.",
            data: null
        })
    }
    return res.status(200).json({
        message: "Fetched successfully.",
        data: patient
    })
});

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById
}