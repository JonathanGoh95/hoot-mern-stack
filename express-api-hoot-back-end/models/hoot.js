const mongoose = require("mongoose");

const { Schema, model } = mongoose;
const CATEGORIES = ["News", "Sports", "Games", "Movies", "Music", "Television"];

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const hootSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Hoot = model("Hoot", hootSchema);

module.exports = Hoot;
