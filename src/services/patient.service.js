const { roles } = require("@src/lib/constant");
const { ApiError } = require("@src/lib/utils");
const { UserModel } = require("@src/models");
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
    filter.role = roles.PATIENT
    options.lean = true
    options.collation = { locale: 'en' }
    // options.select =""
    return await UserModel.paginate(filter, options)
}

const getPatientById = async (patientId = "") => {
    return await UserModel.findOne({ _id: patientId, role: roles.PATIENT })
};

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById
}