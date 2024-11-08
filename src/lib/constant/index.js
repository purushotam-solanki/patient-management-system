module.exports = {
    roles: require('./roles'),
    registrationSource: {
        FORM: "form",
        GOOGLE: "google"
    },
    userStatus: {
        ACTIVE: "active",
        INACTIVE: "inactive"
    },
    appointmentStatus: {
        PENDING: "pending",
        CONFIRMED: "confirmed",
        COMPLETED: "completed",
        CANCELLED: "cancelled",
    }
}