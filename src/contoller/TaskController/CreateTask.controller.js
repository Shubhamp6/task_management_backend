const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");
const { default: mongoose } = require("mongoose");
const {
  PRIORITIES,
  NOTIFICATION_TITLE,
  NOTIFICATION_TYPE,
} = require("../../utils/constants/common.constants");
const ProjectModel = require("../../model/Project.model");
const UploadFileService = require("../../services/UploadFile.service");
const TaskModel = require("../../model/Task.model");
const NotificationModel = require("../../model/Notification.model");
const SendNotifcationService = require("../../services/SendNotification.service");
const ReminderModel = require("../../model/Reminder.model");
const { compareSync } = require("bcrypt");

const CreateTaskController = [
  body("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task name required")
    .trim()
    .escape(),

  body("description")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task description required")
    .trim()
    .escape(),

  body("project")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Project name required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const project = await ProjectModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!project) {
          throw Error("projct id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_project_id")
    .trim(),

  body("priority")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task priority is required!")
    .bail()
    .custom((val) => {
      if (!Object.values(PRIORITIES).includes(val)) {
        throw Error("bad_priority_selcetion");
      }
      return true;
    })
    .trim()
    .escape(),

  body("start_date")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task start date required!")
    .trim()
    .escape(),
  body("due_date")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task due date required!")
    .trim()
    .escape(),
  body("due_time")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Task due time required!")
    .trim()
    .escape(),

  check("attachmentFiles")
    .optional()
    .custom((value, { req }) => {
      // console.log("Working in frontend")
      if (value.length == 0) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("Attachments required"),

  // body("assignor.id")
  //   .optional()
  //   .notEmpty({ ignore_whitespace: true })
  //   .withMessage("Assignor Required")
  //   .bail()
  //   .custom(async (val, { req }) => {
  //     if (val) {
  //       const user = await UserModel.findOne({
  //         _id: mongoose.Types.ObjectId(val),
  //       });
  //       console.log(req.body);
  //       if (
  //        !user
  //         user.first_name != req.body.assignor.first_name ||
  //         user.last_name != req.body.assignor.last_name
  //       ) {
  //         throw Error("Assignor not valid");
  //       }
  //     }
  //     return val;
  //   })
  //   .withMessage("invalid_assignor_id")
  //   .trim()
  //   .escape(),

  body("initial_assignees")
    .isArray({ min: 1 })
    .withMessage("Assignees required"),

  body("initial_assignees.*.id")
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("initial assignees not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_assignee_id")
    .trim()
    .escape(),
  body("reporter.id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("reporter_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (
          !user ||
          user.first_name != req.body.reporter.first_name ||
          user.last_name != req.body.reporter.last_name
        ) {
          throw Error("Reporter not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_reporter_id")
    .trim()
    .escape(),

  body("parent_task")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Parent task required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const project = await ProjectModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!project) {
          throw Error("task not valid");
        }
      }
      return val;
    })
    .withMessage("parent_task_id")
    .trim(),

  PayloadValidatorMiddleware,

  async (req, res, next) => {
    try {
      console.log(req.body);
      const {
        name,
        description,
        project,
        priority,
        start_date,
        due_date,
        due_time,
        attachmentFiles,
        initial_assignees,
        reporter,
        parent_task,
      } = req.body;
      const srNo = req.user.totalTask || 0 + 1;
      await UserModel.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        { totalTask: req.user.totalTask + 1 }
      );
      // console.log(name, assignor);
      const assignees_with_add_authority = initial_assignees;

      // Make creator of task assignor
      const assignor = {
        id: mongoose.Types.ObjectId(req.user._id),
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        employee_code: req.user.employee_code,
      };

      // Create new task
      const task = await TaskModel.create({
        name,
        description,
        project,
        priority,
        attachmentFiles,
        start_date,
        due_date,
        due_time,
        assignor,
        initial_assignees,
        assignees_with_add_authority,
        reporter,
        parent_task,
        srNo,
      });

      const sendTo = initial_assignees.map((assignee) => {
        return assignee.id;
      });
      // Adding notification of task created in notification model
      await NotificationModel.create({
        title: NOTIFICATION_TITLE.taskAssignedPrimary,
        body: `${name} is assinged to you by ${assignor.first_name} ${assignor.last_name}`,
        task: task._id,
        type: NOTIFICATION_TYPE.taskAssignedPrimary,
        sentTo: sendTo,
      });
      await NotificationModel.create({
        title: NOTIFICATION_TITLE.taskAccepted,
        body: `You are added to ${name} task as reporter by ${assignor.first_name} ${assignor.last_name}`,
        task: task._id,
        type: NOTIFICATION_TYPE.taskAccepted,
        sentTo: [reporter.id],
      });

      await NotificationModel.create({
        title: NOTIFICATION_TITLE.taskAccepted,
        body: `You have accepted task - ${name}`,
        task: task._id,
        type: NOTIFICATION_TYPE.taskAccepted,
        sentTo: [],
      });
      await NotificationModel.create({
        title: NOTIFICATION_TITLE.taskDeclined,
        body: `You have declined task - ${name}`,
        task: task._id,
        type: NOTIFICATION_TYPE.taskDeclined,
        sentTo: [],
      });

      // Sending notification to all concern persons
      await SendNotifcationService(
        {
          title: NOTIFICATION_TITLE.taskAssignedPrimary,
          body: `${name} is assinged to you by ${assignor.first_name} ${assignor.last_name}`,
        },
        sendTo
      );

      await SendNotifcationService(
        {
          title: NOTIFICATION_TITLE.taskAccepted,
          body: `You are added to ${name} task as reporter by ${assignor.first_name} ${assignor.last_name}`,
        },
        [reporter.id]
      );

      // Scheduling reminders for the task
      const dueDate = new Date(due_date);
      const dueTime = new Date(due_time);
      const year = dueDate.getFullYear(),
        month = dueDate.getMonth(),
        date = dueDate.getDate(),
        hours = dueTime.getHours(),
        minutes = dueTime.getMinutes();
      const deadline = new Date(year, month, date, hours, minutes),
        currentTime = new Date().getTime();
      const reminders = [];
      if (currentTime + 2 * 24 * 60 * 60 * 1000 < deadline.getTime())
        reminders.push({
          task: mongoose.Types.ObjectId(task._id),
          scheduled_time: new Date(
            deadline.getTime() - (53 * 60 * 60 * 1000 + 30 * 60 * 1000)
          ),
          body: `Task - ${name} has dealine on ${deadline.toDateString()}`,
        });
      if (currentTime + 24 * 60 * 60 * 1000 < deadline.getTime())
        reminders.push({
          task: mongoose.Types.ObjectId(task._id),
          scheduled_time: new Date(
            deadline.getTime() - (29 * 60 * 60 * 1000 + 30 * 60 * 1000)
          ),
          body: `Task - ${name} has dealine on ${deadline.toDateString()}`,
        });
      if (currentTime + 15 * 60 * 60 * 1000 < deadline.getTime())
        reminders.push({
          task: mongoose.Types.ObjectId(task._id),
          scheduled_time: new Date(
            deadline.getTime() - (20 * 60 * 60 * 1000 + 30 * 60 * 1000)
          ),
          body: `Task - ${name} has dealine on ${deadline.toDateString()}`,
        });
      if (currentTime - 10 * 60 * 60 * 1000 < deadline.getTime())
        reminders.push({
          task: mongoose.Types.ObjectId(task._id),
          scheduled_time: new Date(
            deadline.getTime() - (15 * 60 * 60 * 1000 + 30 * 60 * 1000)
          ),
          body: `Task - ${name} has dealine on ${deadline.toDateString()}`,
        });
      if (currentTime - 5 * 60 * 60 * 1000 < deadline.getTime())
        reminders.push({
          task: mongoose.Types.ObjectId(task._id),
          scheduled_time: new Date(
            deadline.getTime() - (10 * 60 * 60 * 1000 + 30 * 60 * 1000)
          ),
          body: `Task - ${name} has dealine on ${deadline.toDateString()}`,
        });
      console.log("task create");
      await ReminderModel.insertMany(reminders);

      return apiResponseHelper.successResponse(res, "task succeffuly created");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, e.message);
    }
  },
];

module.exports = CreateTaskController;
