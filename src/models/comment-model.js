const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "recipe",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Comment = mongoose.model("comment", CommentSchema);

module.exports = Comment;
