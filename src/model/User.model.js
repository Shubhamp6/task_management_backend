const mongoose = require("mongoose");

const { hashPass } = require("../utils/passEncDec.helper");

const Userschema = mongoose.Schema(
  {
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
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    totalTasks: {
      type: Number,
      required: true,
      default: 0,
    },
    // department: {
    //   type: String,
    //   required: true,
    // },
    // designation: {
    //   type: String,
    //   required: true,
    // },

    // birth_date: {
    //   type: Date,
    //   required: true,
    // },
    // anniversary_date: {
    //   type: Date,
    // },
    // company: {
    //   type: String,
    //   required: true,
    // },
    // phone: {
    //   type: Number,
    //   required: true,
    // },
    // office_address: {
    //   type: String,
    //   required: true,
    // },
    // aadhar_no: {
    //   type: Number,
    //   required: true,
    // },jwt
    fcm_token: {
      type: String,
    },
    refresh_token: String,
    access_token: String,
  },
  { timestamps: true }
);

//hash the password

Userschema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = hashPass(this.password);
});

module.exports = mongoose.model("Users", Userschema);
