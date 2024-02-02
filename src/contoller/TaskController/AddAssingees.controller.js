const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");
const {
  TASK_ACTION_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_TITLE,
} = require("../../utils/constants/common.constants");
const UserModel = require("../../model/User.model");
const NotificationModel = require("../../model/Notification.model");
const SendNotifcationService = require("../../services/SendNotification.service");

const AddAssingeesController = [
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_id_required"),
  body("secondary_assignees.*.id")
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("assignees not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_assignee_id")
    .trim(),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const secondary_assignees = req.body.secondary_assignees,
        taskId = mongoose.Types.ObjectId(req.body.id),
        userId = mongoose.Types.ObjectId(req.user._id);

      const task = await TaskModel.findOneAndUpdate(
        {
          _id: taskId,
        },
        { $push: { intial_assingees: { $each: secondary_assignees } } }
      );

      const sendTo = secondary_assignees.map((assignee) => {
        return assignee.id;
      });

      // Adding notification of task created in notification model
      await NotificationModel.create({
        title: NOTIFICATION_TITLE.taskAssignedSecondary,
        body: `${task.name} is assinged to you by ${req.user.first_name} ${req.user.last_name}`,
        task: task._id,
        type: NOTIFICATION_TYPE.taskAssignedSecondary,
        sentTo: sendTo,
      });

      //Sending notification to all concern persons
      await SendNotifcationService(
        {
          title: NOTIFICATION_TITLE.taskAssignedSecondary,
          body: `${task.name} is assinged to you by ${req.user.first_name} ${req.user.last_name}`,
        },
        sendTo
      );
      return apiResponseHelper.successResponse(res, "new assignees added");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = AddAssingeesController;
