const httpStatus = require("http-status");

const { roles } = require("@src/lib/constant");
const { catchAsync, generateId, pick } = require("@src/lib/utils");
const { AppointmentModel } = require("@src/models");
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
/**
 * As of now all roles can udpate the same fields in appointments,
 * In future if there comes a situation, where every role can update the appointments details
 * seprately, then we will need to declare seprate route and needs to the req body validion seprately
 * to acheive sepratio of concern.
 */
const updateAppointment = catchAsync(async (req, res) => {
    const user = req.user || {}
    const { role } = user || {}
    const appointmentId = req.params.appointmentId
    const updatedDetails = req.body;
    updatedDetails.updatedBy = user?._id
    /**
     * Validation to make sure that one patient don't transfer his/her appointment
     *  to another patient i.e any relative
     */
    if (role == roles.PATIENT && updatedDetails.patient != user?._id.toString()) {
        return res.status(httpStatus.BAD_REQUEST).json({
            message: "Appointment is not transferable."
        });
    }
    /**
     * Checking if particular appointment belongs to that pateint/doctor or not
     */
    if ([roles.DOCTOR, roles.PATIENT].includes(role)) {
        let filter = {};
        if (role == roles.PATIENT) {
            filter.patient = user?._id
        } else {
            filter.doctor = user?._id
        }
        const existingAppointment = await AppointmentModel.findOne(filter, { _id: 1 }).lean();
        if (!existingAppointment) {
            return res.status(httpStatus.NOT_FOUND).json({
                messsage: "Appointment details not found.",
                data: null
            })
        }
    }
    /**
     * TODO: Add validation for doctor also so that no doctor can change his patient
     * and to avoid the misuse of system by doctor
     */

    const appointment = await appointmentService.updateAppointment(appointmentId, updatedDetails);
    if (!appointment) {
        return res.status(httpStatus.NOT_FOUND).json({
            message: "Patient not found.",
            data: null
        })
    };
    return res.status(httpStatus.OK).json({
        message: "Details updated successfully.",
        data: appointment
    })

});

module.exports = {
    create,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    deleteAppointmentById,
    updateAppointment
}