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
    .withMessage("task_id_required"),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const action = req.body.action,
        taskId = mongoose.Types.ObjectId(req.body.id),
        userId = mongoose.Types.ObjectId(req.user._id),
        name = `${req.user.first_name} ${req.user.last_name}`;

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
            },
          },
        };
        notification = {
          title: NOTIFICATION_TITLE.taskAccepted,
        };
      } else {
        update = {
          $pull: { initial_assingees: { id: userId } },
          $push: {
            assignees_not_working: {
              id: userId,
              first_name: req.user.first_name,
              last_name: req.user.last_name,
            },
          },
        };
        notification = {
          title: NOTIFICATION_TITLE.taskDeclined,
        };
      }

      const task = await TaskModel.findOneAndUpdate(
        { _id: taskId, initial_assignees: userId },
        {
          ...update,
        }
      );

      if (notification.title == NOTIFICATION_TITLE.taskAccepted)
        notification.body = `${name} has accepted ${task.name} task assinged by you`;
      else
        notification.body = `${name} has declined ${task.name} task assinged by you`;

      await SendNotifcationService(notification, [task.assignor.id]);

      await NotificationModel.create({
        title: notification.title,
        body: notification.body,
        task: task._id,
        type: NOTIFICATION_TYPE.taskAssigned,
        sentTo: [task.assignor.id],
      });

      return apiResponseHelper.successResponse(res, "task details updated");
    } catch (e) {
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = AcceptOrDeclineTaskController;
