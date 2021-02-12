const mongoose = require("mongoose");
const validator = require("validator");
const { Property } = require("../../models/properties-model");


const EmployeeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            trim: true,
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
        referer_id: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "The phone number field is required"],
            trim: true,
            unique: true,
            validate: {
                validator: (phone) => validator.isMobilePhone(phone),
                message: (props) => `${props.value} is not a valid phone number`,
            },
        },
    },
    {
        timestamps: true,
    },
);
EmployeeSchema.post("remove", async (employee) => {
    await Property.deleteMany({ employee_id: employee._id });
})

module.exports = EmployeeSchema
