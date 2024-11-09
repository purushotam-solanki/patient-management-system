const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    ADMIN_JWT_ACCESS_TOKEN_SECRET: Joi.string().required().description('JWT access secret key'),
    ADMIN_JWT_REFRESH_TOKEN_SECRET: Joi.string().required().description('JWT  refresh secret key'),
    DOCTOR_JWT_ACCESS_TOKEN_SECRET: Joi.string().required().description('JWT access secret key'),
    DOCTOR_JWT_REFRESH_TOKEN_SECRET: Joi.string().required().description('JWT  refresh secret key'),
    PATIENT_JWT_ACCESS_TOKEN_SECRET: Joi.string().required().description('JWT access secret key'),
    PATIENT_JWT_REFRESH_TOKEN_SECRET: Joi.string().required().description('JWT  refresh secret key'),
    LOGIN_OTP_EXP_MINUTES: Joi.string().required().description("Login OTP expiration minutes"),
    TRANSMIT_COOKIE_OVER_SECURE_NETWORK: Joi.boolean().required().description("cookie option")
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
  },
  jwt: {
    adminAccessTokenSecret: envVars.ADMIN_JWT_ACCESS_TOKEN_SECRET,
    adminRefreshTokenSecret: envVars.ADMIN_JWT_REFRESH_TOKEN_SECRET,

    doctorAccessTokenSecret: envVars.DCOTOR_JWT_ACCESS_TOKEN_SECRET,
    doctorRefreshTokenSecret: envVars.DOCTOR_JWT_REFRESH_TOKEN_SECRET,

    patientAccessTokenSecret: envVars.PATIENT_JWT_ACCESS_TOKEN_SECRET,
    patientRefreshTokenSecret: envVars.PATIENT_JWT_REFRESH_TOKEN_SECRET,

    adminAccessExpirationMinutes: envVars.ADMIN_JWT_ACCESS_EXPIRATION_MINUTES,
    adminRefreshExpirationDays: envVars.ADMIN_JWT_REFRESH_EXPIRATION_DAYS,

    doctorAccessExpirationMinutes: envVars.DOCTOR_JWT_ACCESS_EXPIRATION_MINUTES,
    doctorRefreshExpirationDays: envVars.DOCTOR_JWT_REFRESH_EXPIRATION_DAYS,

    patientAccessExpirationMinutes: envVars.PATIENT_JWT_ACCESS_EXPIRATION_MINUTES,
    patientRefreshExpirationDays: envVars.PATIENT_JWT_REFRESH_EXPIRATION_DAYS,
  },
  otpexpMinutes: {
    login: envVars.LOGIN_OTP_EXP_MINUTES
  },
  cookieOptions: {
    secure: envVars.TRANSMIT_COOKIE_OVER_SECURE_NETWORK
  }

};