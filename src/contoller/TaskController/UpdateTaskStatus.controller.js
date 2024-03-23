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
    .notEmpty({ ignore_whitespace: true })
    .withMessage("status_type_required")
    .custom((val) => {
      if (
        !Object.values(TASK_STATUS_TYPE).includes(val) ||
        val === TASK_STATUS_TYPE.completed
      ) {
        throw Error("bad_status_type_selection");
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
    .notEmpty({ ignore_whitespace: true })
    .withMessage("description_required")
    .trim()
    .escape(),
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const updatedData = req.body;
      const taskDet = await TaskModel.findById(
        mongoose.Types.ObjectId(updatedData.id)
      );
      if (updatedData.status.compeletion_percentage) {
        if (
          Number(taskDet.status.compeletion_percentage) +
            Number(updatedData.status.compeletion_percentage) >
          100
        )
          return apiResponseHelper.validationErrorWithData(
            res,
            "invalid percentage added",
            updatedData
          );
        taskDet.status.compeletion_percentage =
          Number(taskDet.status.compeletion_percentage) +
          Number(updatedData.status.compeletion_percentage);
        if (taskDet.status.compeletion_percentage === 100) {
          taskDet.status.type = TASK_STATUS_TYPE.completed;
        }
      } else if (
        updatedData.status.type === TASK_STATUS_TYPE.onHold ||
        updatedData.status.type === TASK_STATUS_TYPE.rejected
      ) {
        taskDet.status.type = updatedData.status.type;
      }
      // if (updatedData.status) {
      //   status["status.compeletion_percentage"] =
      //     updatedData.status.compeletion_percentage;
      //   status["status.type"] = updatedData.status.type;
      //   if (!updatedData.description)
      //     updatedData.description = `${req.user.first_name} ${req.user.last_name} changed task status`;
      // }
      console.log(taskDet.status);
      const task = await TaskModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(updatedData.id) },
        {
          $push: {
            status_update_history: {
              description: updatedData.description,
              time: new Date(new Date().getTime() + 5 * 60 * 60 * 1000 +  30 * 60 * 1000),
              changeDoneBy: `${req.user.first_name} ${req.user.last_name} (${req.user.employee_code})`,
            },
          },
          status: taskDet.status,
        },
        { new: true }
      );
      console.log(task);
      if (
        taskDet.status.type === TASK_STATUS_TYPE.completed ||
        taskDet.status.type === TASK_STATUS_TYPE.onHold ||
        taskDet.status.type === TASK_STATUS_TYPE.rejected
      ) {
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
