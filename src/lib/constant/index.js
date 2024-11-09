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
    },
    authTokenCookiesKeys: {
        ACCESS_TOKEN: "acs_tkn_pms",
        REFRESH_TOKEN: "rfh_tkn_pms",
    },
    authTokenTypes: {
        ACCESS: 'access',
        REFRESH: 'refresh',
    }
}