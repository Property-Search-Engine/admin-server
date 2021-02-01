const { PropertyMinSchema } = require("./property-min")

module.exports = new mongoose.Schema(
    {
        _id: {
            type: Mongoose.SchemaTypes.ObjectId
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
            trim: true
        },
        properties: [{
            type: PropertyMinSchema
        }]
    },
    {
        timestamps: true,
    },
);
