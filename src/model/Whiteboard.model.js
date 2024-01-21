const mongoose = require("mongoose");

const Whiteboardschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
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
      employee_code: {
        type: String,
        required: true,
      },
    },
    shared_with: [
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
        employee_code: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("whiteboards", Whiteboardschema);
