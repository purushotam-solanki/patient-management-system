const httpStatus = require("http-status");

const { ApiError } = require("@src/lib/utils");
const { AppointmentModel, UserModel } = require("@src/models");

const createAppointment = async (data = {}) => {
    /**
     * Addning validation to check that if doctor exists in our system or not
     * to avoid abuse of system and to maintain the consistency of data to make sure that 
     * no appointment exists without doctor
     */
    const doctor = await UserModel.findById(data.doctor, { _id: 1 }).lean()
    if (!doctor) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Doctor not found.")
    }
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

const updateAppointment = async (appointmentId = "", updatedDetails = {}) => {
    try {
        const projection = {
            otpDetails: 0,
            statusHistory: 0
        };
        const data = await AppointmentModel.findOneAndUpdate(
            { _id: appointmentId },
            {
                $set: updatedDetails
            },
            {
                new: true,
                runValidators: true,
                projection: { statusHistory: 0, otpDetails: 0 }
            }).populate([
                {
                    path: "doctor",
                    select: projection
                },
                {
                    path: "patient",
                    select: projection
                }
            ]);
        return data
    } catch (e) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error in updating details.")
    }
}

module.exports = {
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    deleteAppointment,
    updateAppointment
}