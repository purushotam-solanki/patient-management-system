const router = require('express').Router();

const authRoutes = require("@routes/v1/auth.routes")
const patientRoutes = require("@routes/v1/patient.routes")
const appointmentRoutes = require("@routes/v1/appointment.routes")


const defaultRoutes = [
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/patient",
        route: patientRoutes
    },
    {
        path: "/appointment",
        route: appointmentRoutes
    }
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router