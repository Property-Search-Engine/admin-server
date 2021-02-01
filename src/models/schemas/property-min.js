const mongoose = require("mongoose");
const validator = require("validator");

const { addressSchema, options } = require("./property")

const PropertyMinSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true
        },
        price: {
            type: Number,
            min: 0,
            required: true,
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

//Office
const OfficeMinSchema = new mongoose.Schema({
    buildingUse: {
        type: String,
        enum: ["private", "coWorking", "securitySystem"],
        required: true,
    },
});


module.exports = { PropertyMinSchema, HomeMinSchema, OfficeMinSchema }