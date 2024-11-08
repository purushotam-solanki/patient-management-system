const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { roles, registrationSource, userStatus } = require('@lib/constant');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
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
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*`~"()_+\-=[\]{};:'\\|,.<>/?])[A-Za-z\d!@#$%^&*`~"()_+\-=[\]{};:'\\|,.<>/?]{8,}$/)) {
                    throw new Error('Password must contain at least one uppercase, one lowercase, a special character and minimum 8 characters');
                }
            },
            private: true, // used by the toJSON plugin
        },
        role: {
            type: String,
            enum: Object.values(roles),
        },
        profilePic: {
            type: String
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        source: {
            type: String,
            enum: Object.values(registrationSource),
            private: true
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
                index: true,

            }
        },
        /*Aceess tokens which is issued before this time will be treated as invalid token
        This time will be updated whenever user resets his/her password */
        passwordChangedAt: {
            type: Date,
            private: true
        },
        TnC: {
            type: Boolean,
            required: true,
            private: true
        },
        userId: {
            type: String,
            unique: true,
            index: true,
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

        }]
    },
    {
        timestamps: true,
    }
);

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
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, Number(process.env.PASSWORD_SALT_FACTOR));
    }
    next();
});

/**
 * @typedef User
 */
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;