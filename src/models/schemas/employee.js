const mongoose = require("mongoose");
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: [true, "First name field is required"],
            trim: true,
            minlength: 3,
        },
        lastname: {
            type: String,
            required: [true, "Last name field is required"],
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: validator.isEmail,
                message: (props) => `${props.value} is not a valid email address`,
            },
        },
        phone: {
            type: String,
            required: [true, "The phone number field is required"],
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = EmployeeSchema
