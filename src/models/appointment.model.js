const mongoose = require('mongoose');

const { appointmentStatus } = require('@src/lib/constant');

const appointmentSchema = mongoose.Schema(
    {
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
        appointementAt: {
            type: Date(),
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(appointmentStatus)
        }
    },
    {
        timestamps: true,
    }
);

const AppointmentModel = mongoose.model('appointment_schema', appointmentSchema);

module.exports = AppointmentModel;