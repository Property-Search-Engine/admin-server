const mongoose = require("mongoose");
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
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
        toJSON: { virtuals: true },  //So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true }  //So `toObject()` output includes virtuals
    },
);

EmployeeSchema.virtual('properties', {
    ref: 'Property', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'employee_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: false,
});

module.exports = EmployeeSchema
