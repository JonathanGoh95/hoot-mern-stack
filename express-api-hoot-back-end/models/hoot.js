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
      trim: true,
      minLength: 3,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: CATEGORIES,
    },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Hoot = model("Hoot", hootSchema);

module.exports = Hoot;
