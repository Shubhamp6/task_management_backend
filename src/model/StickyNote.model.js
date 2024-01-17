const mongoose = require("mongoose");

const StickyNoteschema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("stickynotes", StickyNoteschema);
