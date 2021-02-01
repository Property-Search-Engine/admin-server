const mongoose = require("mongoose");
const validator = require("validator");

const { addressSchema, options } = require("./property")

const PropertyMinSchema = new mongoose.Schema(
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
        image: {
            type: String,
            validate: {
                validator: url => validator.isURL(url),
                message: "Images should have a valid url",
            }
        },
        address: {
            type: addressSchema,
            required: true,
            unique: true,
        },
        publishDate: {
            type: Date,
            default: Date.now,
        },
        sold: {
            type: Boolean,
            default: false,
        },
    },
    options,
);

// Home
const HomeMinSchema = new mongoose.Schema({
    homeType: {
        type: String,
        enum: ["flat_apartment", "house", "duplex", "penthouse"],
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
    surface: {
        type: Number,
        min: 1,
        required: true,
    },
});



module.exports = { PropertyMinSchema, HomeMinSchema }