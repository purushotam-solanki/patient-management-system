# Patient Management System (PMS)

A comprehensive Patient Management System for Orthodontists, developed with Node.js and Express, to simplify and streamline patient record management, appointment scheduling, and role-based access control.

## Technologies Used

- **Node.js**: v20.14.0
- **NPM**: v10.7.0
- **Express.js**: RESTful API framework
- **MongoDB**: NoSQL database for data storage
- **JWT Authentication**: Token-based authentication for role-based access control

## Features

- **Patient Management**: Create, read, update, and delete patient records.
- **Appointment Scheduling**: Efficient appointment booking and management.
- **Role-Based Access Control (RBAC)**: Different user roles (e.g., Admin, Doctor, Patient) with specific access levels.
- **RESTful APIs**: All functionalities are exposed via secure APIs for easy integration with other platforms or frontends.
- **Error Handling**: Comprehensive error handling and logging for reliable performance.

## Getting Started

### Prerequisites

- Node.js v20.14.0 or later
- NPM v10.7.0 or later
- MongoDB instance (local or cloud-based)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/purushotam-solanki/patient-management-system.git
   cd patient-management-system
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment Variables**:
   Set up a `.env` file in the root directory with the following variables:

   ```env
   PORT=3003
   NODE_ENV=development

   # Cookie options
   TRANSMIT_COOKIE_OVER_SECURE_NETWORK=false

   # URL of the MongoDB
   MONGODB_URL=mongodb://127.0.0.1:27017

   # JWT secrets for admin
   ADMIN_JWT_ACCESS_TOKEN_SECRET=adminthisisaccesstokensecret
   ADMIN_JWT_REFRESH_TOKEN_SECRET=adminthisisrefreshtokensecret

   # JWT secrets for doctor
   DOCTOR_JWT_ACCESS_TOKEN_SECRET=trainerthisisaccesstokensecret
   DOCTOR_JWT_REFRESH_TOKEN_SECRET=trainerthisisrefreshtokensecret

   # JWT secrets for patient
   PATIENT_JWT_ACCESS_TOKEN_SECRET=userthisisaccesstokensecret
   PATIENT_JWT_REFRESH_TOKEN_SECRET=userthisisrefreshtokensecret

   # Expiration settings for admin tokens
   ADMIN_JWT_ACCESS_EXPIRATION_MINUTES=500
   ADMIN_JWT_REFRESH_EXPIRATION_DAYS=2

   # Expiration settings for doctor tokens
   DOCTOR_JWT_ACCESS_EXPIRATION_MINUTES=300
   DOCTOR_JWT_REFRESH_EXPIRATION_DAYS=2

   # Expiration settings for patient tokens
   PATIENT_JWT_ACCESS_EXPIRATION_MINUTES=15
   PATIENT_JWT_REFRESH_EXPIRATION_DAYS=2

   # OTP expiration setting
   LOGIN_OTP_EXP_MINUTES=5

   ```

4. **Run the Application**:

```bash
npm start
or
npm run dev (to take advantage of nodemon in develop enviroment)
```

5. **Accessing the APIs**:
   - The APIs will be available at `http://localhost:<PORT>`.

## API Endpoints

          |

### Authentication

- Users must log in with valid credentials to access protected routes.
- JWT tokens are used for user session management and to enforce role-based access.

## Project Structure

```bash
patient-management-system
├── src/      # API request handlers
    ├── controllers/      # API request handlers
    │   ├── patient.controller.js
    │   ├── appointment.controller.js
    │   └── auth.controller.j
    ├── lib/              # lib
    │   ├── config/
        │   ├── cookies.js
        │   ├── cors.js
        │   └── envConfig.js
        │   └── envFlag.js
        │   └── logger.js
        │   └── morgan.js
        │   └── passport.js
    │   ├── constant/
        │   ├── index.js
        │   ├── roles.js
    │   ├── utils/
        │   ├── APiError.js
        │   ├── catchAsync.js
        │   └── generateId.js
        │   └── pick.js
        │   └── validations.js
    │   ├── middlewares/
        │   ├── authAny.js
        │   ├── error.js
        │   └── slowloris.js
        │   └── validate.js
    │   ├── permissions/
        │   ├── adminPermissions.js
        │   ├── doctorPermissions.js
        │   └── patientPermissions.js
    ├── models/           # Mongoose models for Patient, Appointment, User, AuthTokens
    │   ├── Patient.js
    │   ├── Appointment.js
    │   ├── User.js
    │   └── AuthToken.js
    ├── reqValidations/    # Definition of incoming request
    │   ├── appointment.validations.js
    │   ├── patient.validations.js
    ├── routes/
        ├── v1/         # Route definitions
        │   ├── patient.routes.js
        │   ├── appointment.routes.js
        │   └── auth.routes.js
    └── app.js            # Main application file
    └── index.js        # Mongodb connection and process exit handler

```

## Contact

For any inquiries or feedback, feel free to contact [psolanki0004@gmail.com].
