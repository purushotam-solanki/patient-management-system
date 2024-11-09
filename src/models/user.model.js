const mongoose = require('mongoose');
const validator = require('validator');
const paginate = require("mongoose-paginate-v2")

const { roles, userStatus } = require('@lib/constant');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Invalid email');
                }
            },
        },
        role: {
            type: String,
            enum: Object.values(roles),
        },
        profilePic: {
            type: String
        },
        phoneNumber: {
            countryCode: {
                type: String,
                required: true
            },
            number: {
                type: String,
                unique: true,
                required: true,
                index: true
            }
        },
        userId: {
            type: String,
            unique: true,
            index: true,
        },
        otpDetails: {
            otp: {
                type: Number
            },
            expAt: {
                type: Number
            }
        },
        status: {
            type: String,
            enum: Object.values(userStatus),
            default: userStatus.ACTIVE
        },
        statusHistory: [{
            status: {
                type: String,
                enum: Object.values(userStatus)
            },
            updatedBy: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'User',
            },
            reason: {
                type: String,
                trim: true
            },
            updatedOn: {
                type: Date
            },

        }],
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            index: true
        },
        updatedBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            index: true
        }
    },
    {
        timestamps: true,
    }
);

//Plugins
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
};

userSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeUserId) {
    phoneNumber = phoneNumber?.toString()
    const user = await this.findOne({ "phoneNumber.number": phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
};

/**
 * @typedef User
 */
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;