const mongoose = require("mongoose");

const MindMapschema = mongoose.Schema(
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
    nodes: [
      {
        id: {
          type: Number,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        parentId: [
          {
            type: Number,
            required: true,
          },
        ],
      },
    ],
    edges: [
      {
        from: {
          type: Number,
          required: true,
        },
        to: {
          type: Number,
          required: true,
        },
        parentId: [
          {
            type: Number,
            required: true,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("mindmap", MindMapschema);
