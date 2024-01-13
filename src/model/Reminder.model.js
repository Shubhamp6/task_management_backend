const mongoose = require("mongoose");

const Reminderschema = mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.ObjectId,
      ref: "tasks",
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    scheduled_time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminders", Reminderschema);
