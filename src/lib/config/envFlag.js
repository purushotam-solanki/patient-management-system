const ENV = process.env.NODE_ENV;

const isDevEnv = ENV?.includes("development");
const isUatEnv = process.env.NODE_ENV?.includes("uat")
const isProduction = process.env.NODE_ENV == "production" ? true : false

module.exports = {
    isDevEnv,
    isUatEnv,
    isProduction
};