const mongoose = require("mongoose");
const { PROJECT_TYPES } = require("../utils/constants/common.constants");

const Projectschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
    },
    type: {
      type: String,
      enum: PROJECT_TYPES,
      required: true,
    },
    due_date: {
      type: Date,
    },
    head: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
      },
      first_name: {
        type: String,
        required: true,
      },
      last_name: {
        type: String,
        required: true,
      },
    },
    members: [
      {
        id: {
          type: mongoose.Schema.ObjectId,
          ref: "users",
          required: true,
        },
        first_name: {
          type: String,
          required: true,
        },
        last_name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Projects", Projectschema);
