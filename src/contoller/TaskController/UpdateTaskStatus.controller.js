const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");
const {
  TASK_STATUS_TYPE,
  NOTIFICATION_TITLE,
  NOTIFICATION_TYPE,
} = require("../../utils/constants/common.constants");
const NotificationModel = require("../../model/Notification.model");
const SendNotifcationService = require("../../services/SendNotification.service");

const UpdateTaskStatusController = [
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_id_required")
    .custom(async (val, { req }) => {
      if (val) {
        const task = await TaskModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!task) {
          throw Error("task not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_task_id")
    .trim()
    .escape(),
  body("status.type")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("status_type_required")
    .custom((val) => {
      if (!Object.values(TASK_STATUS_TYPE).includes(val)) {
        throw Error("bad_status_type_selcetion");
      }
      return true;
    })
    .trim()
    .escape(),
  body("status.compeletion_percentage")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("compeletion_type_required")
    .trim()
    .escape(),
  body("description")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("description_required")
    .trim()
    .escape(),
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const updatedData = req.body;
      const status = {};
      if (updatedData.status) {
        status["status.compeletion_percentage"] =
          updatedData.status.compeletion_percentage;
        status["status.type"] = updatedData.status.type;
        if (!updatedData.description)
          updatedData.description = `${req.user.first_name} ${req.user.last_name} changed task status`;
      }
      console.log(status);
      const task = await TaskModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(updatedData.id) },
        {
          $push: {
            status_update_history: {
              description: updatedData.description,
              time: new Date(),
            },
          },
          $set: status,
        },
        { new: true }
      );
      console.log(task);
      if (updatedData.status && updatedData.status.type) {
        const sendTo = task.assignees_working.map((assignee) => {
          return assignee.id;
        });
        sendTo.push(task.reporter.id);
        sendTo.push(task.assignor.id);

        await NotificationModel.create({
          title: NOTIFICATION_TITLE.taskStatusChanged,
          body: `${task.name} status changed`,
          task: task._id,
          type: NOTIFICATION_TYPE.taskStatusChanged,
          sentTo: sendTo,
        });

        //Sending notification to all concern persons
        await SendNotifcationService(
          {
            title: NOTIFICATION_TITLE.taskStatusChanged,
            body: `${task.name} status changed`,
          },
          sendTo
        );
      }
      return apiResponseHelper.successResponseWithData(
        res,
        "task status changed successfuly",
        task
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = UpdateTaskStatusController;
