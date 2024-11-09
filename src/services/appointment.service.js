const { ApiError } = require("@src/lib/utils");
const { AppointmentModel } = require("@src/models");

const createAppointment = async (data = {}) => {
    return await AppointmentModel.create(data)
};

const getAllAppointments = async (filter = {}, options = {}) => {
    options.lean = true
    options.collation = { locale: 'en' }
    // options.select =""
    return await AppointmentModel.paginate(filter, options)
}

const getAppointmentById = async (appointmentId = "") => {
    return await AppointmentModel.findById(appointmentId)
};

const deleteAppointment = async (filter = {}) => {
    if (!filter || filter == {}) {
        throw new ApiError(400, "Operation failed.")
    };
    //NOTE: Patient/Admin can delete mul
    return AppointmentModel.deleteOne(filter)
}
module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    deleteAppointment
}