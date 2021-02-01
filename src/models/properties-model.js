const mongoose = require("mongoose");

const {
  PropertySchema,
  OfficeSchema,
  HomeSchema
} = require("./schemas/property")


const Property = mongoose.model("Property", PropertySchema);
const Home = Property.discriminator("Home", HomeSchema);
const Office = Property.discriminator("Office", OfficeSchema);

module.exports = {
  Property,
  Home,
  Office,
};
