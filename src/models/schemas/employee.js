const mongoose = require("mongoose");
const validator = require("validator");
const { PropertyMinSchema, HomeMinSchema, OfficeMinSchema } = require("./property-min")

const EmployeeSchema = new mongoose.Schema(
    {
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
            trim: true
        },
        properties: [PropertyMinSchema]
    },
    {
        timestamps: true,
    },
);
const propertyArr = EmployeeSchema.path("properties");
propertyArr.discriminator("Home", HomeMinSchema);
propertyArr.discriminator("Office", OfficeMinSchema);

module.exports = EmployeeSchema
