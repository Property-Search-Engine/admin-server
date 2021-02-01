const mongoose = require("mongoose");
const validator = require("validator");

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        trim: true,
    },
    number: {
        type: Number,
        required: true,
        min: 0,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    country: {
        type: String,
        required: true,
        trim: true,
    },
    coordinates: {
        type: Object,
        lat: {
            type: Number,
            required: true,
        },
        long: {
            type: Number,
            required: true,
        },
    },
}, { id: false });

/** It gets fullfilled automatically from the controller */
const contactInfoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "employee",
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: phone => validator.isMobilePhone(phone),
            message: (props) => `${props.value} is not a valid phone number`,
        }
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: {
            validator: email => validator.isEmail(email),
            message: (props) => `${props.value} is not a valid email address`,
        }
    },
});

const options = {
    discriminatorKey: "kind",
    timestamps: true
};

const PropertySchema = new mongoose.Schema(
    {
        price: {
            type: Number,
            min: 0,
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        filters: [
            {
                type: String,
                enum: [
                    "petsAllowed",
                    "lift",
                    "garden",
                    "airConditioning",
                    "terrace",
                    "swimming",
                ],
            },
        ],
        images: [
            {
                type: String,
                validate: {
                    validator: url => validator.isURL(url),
                    message: "Images should have a valid url",
                }
            },
        ],
        address: {
            type: addressSchema,
            required: true,
            unique: true,
        },
        contactInfo: {
            type: contactInfoSchema,
            required: true,
        },
        sold: {
            type: Boolean,
            default: false,
        },
        sold_date: {
            type: Date,
        },
    },
    options,
);

// Home
const HomeSchema = new mongoose.Schema({
    homeType: {
        type: String,
        enum: ["flatApartment", "house", "duplex", "penthouse"],
        default: "house",
    },
    bedRooms: {
        type: Number,
        min: 1,
        required: true,
    },
    bathRooms: {
        type: Number,
        min: 1,
        required: true,
    },
    equipment: {
        type: String,
        enum: ["indifferent", "fullyFittedKitchen", "furnished"],
        required: true,
    },
    condition: {
        type: String,
        enum: ["newHome", "goodCondition", "needsRenovation"],
        required: true,
    },
    surface: {
        type: Number,
        min: 1,
        required: true,
    },
});

//Office
const OfficeSchema = new mongoose.Schema({
    buildingUse: {
        type: String,
        enum: ["private", "coWorking", "securitySystem"],
        required: true,
    },
});

module.exports = {
    PropertySchema,
    OfficeSchema,
    HomeSchema,
    options,
    contactInfoSchema,
    addressSchema
}