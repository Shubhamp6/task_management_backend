const { urlencoded } = require("express");
const mongoose = require("mongoose");

const validator = require("validator");
const {
  USER_ROLES,
  USER_DEPARTMENTS,
} = require("../utils/constants/common.constants");

const { hashPass } = require("../utils/passEncDec.helper");

const Userschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    employee_id: {
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
    role: {
      type: Number,
      required: true,
      enum: Object.values(USER_ROLES),
    },

    department: {
      type: mongoose.Schema.ObjectId,
      ref: "departments",
      required: true,
    },
    employee_type: {
      type: mongoose.Schema.ObjectId,
      ref: "employeetypes",
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },

    join_date: {
      type: Date,
      required: true,
      default: new Date().toISOString(),
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "branches",
      default: null,
      // required: true,
    },
    weekly_of: [Number],
    phone: {
      type: Number,
      required: true,
    },
    phone_emergency: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    profile_url: {
      type: String,
      default: null,
    },
    blood_group: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      required: true,
    },

    parent_id: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Users",
      },
    ],

    bank_details: {
      bank_name: {
        type: String,
        required: true,
        lowercase: true,
      },
      account_no: {
        type: Number,
        required: true,
      },
      ifsc_code: {
        type: String,
        required: true,
      },
    },

    pan_no: {
      type: String,
      required: true,
    },
    aadhar_no: {
      type: Number,
      required: true,
    },
    salary: {
      basic_salary: { type: Number, default: 0 },
      house_rent_allowance: { type: Number, default: 0 },
      conveyence_allowance: { type: Number, default: 0 },
      food_allowance: { type: Number, default: 0 },

      other_allowance: { type: Number, default: 0 },
      incencitive: { type: Number, default: 0 },
      medical_allowance: { type: Number, default: 0 },
    },

    taxes: {
      proffesional_tax: { type: Number },
    },
    pf: {
      pf_id: {
        type: String,
        default: null,
      },
      uan_id: {
        type: String,
        default: null,
      },
      pf_percent: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    esic: {
      esic_id: {
        type: String,
        default: null,
      },

      esic_percent: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    nda_url: {
      type: String,
      default: null,
    },
    aggreement_url: {
      type: String,
      default: null,
    },
    addhar_url: {
      type: String,
      default: null,
    },
    pan_url: {
      type: String,
      default: null,
    },

    enabled: {
      type: Boolean,
      default: true,
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
