const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Fácil", "Media", "Dificil"],
    default: "Fácil",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  serves: {
    type: Number,
    required: true,
  },
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  hoursToPrep: {
    type: Number,
    required: true,
    default: 0,
  },
  minutesToPrep: {
    type: Number,
    required: true,
    min: 0,
    max: 60,
  },
  author: {
    type: String,
    required: true,
    ref: "user",
  },
  comments: [
    {
      type: String,
      ref: "comment",
    },
  ],
});

const Recipe = mongoose.model("recipe", RecipeSchema);

module.exports = Recipe;
