const { roles } = require("@src/lib/constant");
const { catchAsync, generateId, pick } = require("@src/lib/utils");
const appointmentService = require('@src/services/appointment.service');

const create = catchAsync(async (req, res) => {
    const data = {
        ...req.body,
        appointmentId: generateId("AP"),
    };
    //TODO: Check for existing appointment with same doctor at same date or time slot
    const appointment = await appointmentService.createAppointment(data);
    return res.status(200).json({
        message: "success",
        data: appointment
    });
});

const getAllAppointments = catchAsync(async (req, res) => {
    const options = pick(req.query, ['limit', 'page']);
    const filter = pick(req.query, ['search']);
    const appointments = await appointmentService.getAllAppointments(filter, options);
    return res.status(200).json({
        message: "success",
        data: appointments
    })
});

const getMyAppointments = catchAsync(async (req, res) => {
    const user = req.user || {};
    const filter = user.role === roles.DOCTOR ? { doctor: user._id } : { patient: user._id };
    const appointments = await appointmentService.getAllAppointments(filter);
    return res.status(200).json({
        status: "success",
        data: appointments
    })
});

const getAppointmentById = catchAsync(async (req, res) => {
    const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
    if (!appointment) {
        return res.status(404).json({
            message: "Appointment not found.",
            data: null
        })
    }
    return res.status(200).json({
        message: "Fetched successfully.",
        data: appointment
    })
});

const deleteAppointmentById = catchAsync(async (req, res) => {
    const user = req.user || {};
    const filter = {
        _id: req.params.appointmentId,
        ...(user?.role == roles.PATIENT && { patient: user?._id })
    }
    const appointment = await appointmentService.deleteAppointment(filter);
    return res.status(200).json({
        message: "Appointment deleted successfully.",
        data: null
    })
});

module.exports = {
    create,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    deleteAppointmentById
}