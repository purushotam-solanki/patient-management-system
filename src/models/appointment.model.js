const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");

const { appointmentStatus } = require('@src/lib/constant');

const appointmentSchema = mongoose.Schema(
    {
        appointmentId: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        patient: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        doctor: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
            index: true
        },
        scheduledAt: {
            date: {
                type: Date,
                required: true
            },
            time: {
                type: String
            }
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(appointmentStatus),
            default: appointmentStatus.PENDING
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'user',
            required: true,
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
appointmentSchema.plugin(paginate)

const AppointmentModel = mongoose.model('appointment', appointmentSchema);

module.exports = AppointmentModel;