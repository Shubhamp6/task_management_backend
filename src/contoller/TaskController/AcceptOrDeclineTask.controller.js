const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");
const { TASK_ACTION_TYPE } = require("../../utils/constants/common.constants");

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
        userId = mongoose.Types.ObjectId(req.user._id);

      if (action == TASK_ACTION_TYPE.accept) {
        await TaskModel.findOneAndUpdate(
          { _id: taskId, initial_assignees: userId },
          {
            $pull: { initial_assignees: userId },
            $push: { assignees_working: userId },
          }
        );
      } else {
        await TaskModel.findOneAndUpdate(
          { _id: taskId, initial_assignees: userId },
          {
            $pull: { initial_assingees: userId },
            $push: { assignees_not_working: userId },
          }
        );
      }
      return apiResponseHelper.successResponse(res, "task details updated");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = AcceptOrDeclineTaskController;
