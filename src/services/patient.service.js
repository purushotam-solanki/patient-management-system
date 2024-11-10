const { roles } = require("@src/lib/constant");
const { ApiError } = require("@src/lib/utils");
const { UserModel, AppointmentModel } = require("@src/models");
const httpStatus = require("http-status");

const createPatient = async (data = {}) => {
    try {
        data.role = roles.PATIENT;
        if (data?.email && await UserModel.isEmailTaken(data?.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken.")
        }
        if (data?.phoneNumber?.number && await UserModel.isPhoneNumberTaken(data?.phoneNumber?.number)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Phone number already taken.")
        }
        return await UserModel.create(data)
    } catch (e) {
        throw new Error(e)
    }
};

const getAllPatients = async (filter = {}, options) => {
    try {
        filter.role = roles.PATIENT
        options.lean = true
        options.collation = { locale: 'en' }
        // options.select =""
        return await UserModel.paginate(filter, options)
    } catch (e) {
        throw new Error(e)
    }
}

const getPatientById = async (patientId = "") => {
    try {
        return await UserModel.findOne({ _id: patientId, role: roles.PATIENT })
    } catch (e) {
        throw new Error(e)
    }
};

const updatePatient = async (patientId = "", updatedDetails = {}) => {
    try {
        const data = await UserModel.findOneAndUpdate(
            { _id: patientId },
            {
                $set: updatedDetails
            },
            {
                new: true,
                runValidators: true,
                projection: { statusHistory: 0, otpDetails: 0 }
            });
        return data
    } catch (e) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error in updating details.")
    }
}

const getDoctorPatients = async (filter = {}, options = {}) => {
    try {
        options.populate = [
            {
                path: "patient"
            }
        ]
        options.select = {
            patient: 1
        }
        const patients = await AppointmentModel.paginate(filter, options);
        return patients
    } catch (e) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error occured.")
    }
}

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    getDoctorPatients
}