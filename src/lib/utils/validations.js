const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

const phoneNumber = (values, helpers) => {
    let { countryCode, number } = values;

    // Remove the "+" symbol from the country code if present
    if (countryCode.startsWith('+')) {
        countryCode = countryCode.slice(1);
    }

    try {
        // Get the region code (ISO 3166-1 alpha-2) from the country calling code
        const regionCode = phoneUtil.getRegionCodeForCountryCode(Number(countryCode));

        // If the region code is not valid, return an error
        if (!regionCode) {
            return helpers.message('Invalid country calling code');
        }

        // Parse the phone number with the determined region code
        const parsedNumber = phoneUtil.parse(number, regionCode);

        // Check if the number is valid
        if (!phoneUtil.isValidNumber(parsedNumber)) {
            return helpers.message('Invalid phone number');
        }

        return values; // Return the validated value
    } catch (error) {
        console.log(error.message)
        return helpers.message('Invalid phone number'); // Handle parsing error
    }
}

module.exports = {
    objectId,
    phoneNumber
}