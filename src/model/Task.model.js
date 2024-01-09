const mongoose = require("mongoose");
const {
  PRIORITIES,
  TASK_STATUS_TYPE,
} = require("../utils/constants/common.constants");

const Taskschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "projects",
      required: true,
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      required: true,
    },
    status: {
      compeletion_percentage: {
        type: Number,
        max: 100,
        default: 0,
      },
      status_type: {
        type: String,
        enum: TASK_STATUS_TYPE,
        default: TASK_STATUS_TYPE.inProgress,
      },
    },
    start_date: {
      type: Date,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    due_time: {
      type: Date,
      required: true,
    },
    attachments: [
      {
        type: String,
      },
    ],
    assignor: {
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
    initial_assignees: [
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
    assignees_working: [
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
    assignees_not_working: [
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
    assingees_with_add_authority: [
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
    repoter: {
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
    parent_task: {
      type: mongoose.Schema.ObjectId,
      ref: "tasks",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tasks", Taskschema);
