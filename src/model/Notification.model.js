const mongoose = require("mongoose");
const {
  PROJECT_TYPES,
  NOTIFICATION_TYPE,
} = require("../utils/constants/common.constants");

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
    task: {
      type:  mongoose.Schema.ObjectId,
      ref: "tasks",
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPE,
      required: true,
    },
    sentTo: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "users",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notifications", Notificationschema);
