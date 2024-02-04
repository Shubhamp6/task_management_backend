const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");
const {
  TASK_ACTION_TYPE,
  NOTIFICATION_TITLE,
  NOTIFICATION_TYPE,
} = require("../../utils/constants/common.constants");
const NotificationModel = require("../../model/Notification.model");
const SendNotifcationService = require("../../services/SendNotification.service");

const AcceptOrDeclineTaskController = [
  body("action")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("action_required"),
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_id_required")
    .bail()
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
    .trim(),
  body("notificationId")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("notification_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const task = await NotificationModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!task) {
          throw Error("notification not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_notification_id")
    .trim(),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const action = req.body.action,
        taskId = mongoose.Types.ObjectId(req.body.id),
        userId = mongoose.Types.ObjectId(req.user._id),
        name = `${req.user.first_name} ${req.user.last_name}`,
        notificationId = mongoose.Types.ObjectId(req.body.notificationId);
      var update = {},
        notification = {};
      if (action == TASK_ACTION_TYPE.accept) {
        update = {
          $pull: {
            initial_assignees: {
              id: userId,
            },
          },
          $push: {
            assignees_working: {
              id: userId,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
              employee_code: req.user.employee_code,
            },
          },
        };
        notification = {
          title: NOTIFICATION_TITLE.taskAccepted,
        };
      } else {
        update = {
          $pull: {
            initial_assignees: {
              id: userId,
            },
          },
          $push: {
            assignees_not_working: {
              id: userId,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
              employee_code: req.user.employee_code,
            },
          },
        };
        notification = {
          title: NOTIFICATION_TITLE.taskDeclined,
        };
      }

      const task = await TaskModel.findOneAndUpdate(
        { _id: taskId, "initial_assignees.id": userId },
        {
          ...update,
        }
      );
      if (notification.title == NOTIFICATION_TITLE.taskAccepted) {
        notification.body = `${name} has accepted ${task.name} task assinged by you`;
        notification.type = NOTIFICATION_TYPE.taskAccepted;
        await NotificationModel.findOneAndUpdate(
          {
            task: task._id,
            sentTo: { $ne: task.assignor.id },
            type: NOTIFICATION_TYPE.taskAccepted,
          },
          {
            $push: { sentTo: userId },
          }
        );
      } else {
        notification.body = `${name} has declined ${task.name} task assinged by you`;
        notification.type = NOTIFICATION_TYPE.taskDeclined;
        await NotificationModel.findOneAndUpdate(
          {
            task: task._id,
            sentTo: { $ne: task.assignor.id },
            type: NOTIFICATION_TYPE.taskDeclined,
          },
          {
            $push: { sentTo: userId },
          }
        );
      }

      await SendNotifcationService(
        { body: notification.body, title: notification.title },
        [task.assignor.id]
      );
      await NotificationModel.findOneAndUpdate(
        {
          _id: notificationId,
        },
        {
          $pull: { sentTo: userId },
        }
      );
      await NotificationModel.create({
        title: notification.title,
        body: notification.body,
        task: task._id,
        type: notification.type,
        sentTo: [task.assignor.id],
      });

      return apiResponseHelper.successResponse(res, "task details updated");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = AcceptOrDeclineTaskController;
