const mongoose = require("mongoose");
const { PROJECT_TYPES } = require("../utils/constants/common.constants");

const Notificationschema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: NOTIFCATION_TYPES,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notifications", Notificationschema);
