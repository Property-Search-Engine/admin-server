const mongoose = require("mongoose");
require("mongoose-type-email");
require("mongoose-type-phone");
var validate = require("mongoose-validator");

const options = { discriminatorKey: "kind" };

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
});

const contactInfoSchema = new mongoose.Schema({
  phone: {
    type: mongoose.SchemaTypes.Phone,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    required: true,
  },
});

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
    publishDate: {
      type: Date,
      default: Date.now,
    },
    filters: [
      {
        type: String,
        enum: [
          "pets_allowed",
          "lift",
          "garden",
          "air_conditioning",
          "terrace",
          "swimming",
        ],
      },
    ],
    images: [
      {
        type: String,
        validate: [
          validate({
            validator: "isURL",
            message: "Images should have a valid url",
          }),
        ],
      },
    ],
    address: {
      type: addressSchema,
      required: true,
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
  equipment: {
    type: String,
    enum: ["indifferent", "fully_fitted_kitchen", "furnished"],
    required: true,
  },
  condition: {
    type: String,
    enum: ["new_homes", "good_condition", "needs_renovation"],
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
  building_use: {
    type: String,
    enum: ["private", "co_working", "security_system"],
    required: true,
  },
});

const Property = mongoose.model("properties", PropertySchema);

const Home = Property.discriminator("Home", HomeSchema);

const Office = Property.discriminator("Office", OfficeSchema);

module.exports = {
  Property,
  Home,
  Office,
};
