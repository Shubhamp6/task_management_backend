const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");
const { TASK_ACTION_TYPE } = require("../../utils/constants/common.constants");

const AcceptOrDeclineTaskController = [
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

      await TaskModel.findOneAndUpdate(
        {
          _id: taskId,
          "assingees_with_add_authority.id": userId,
        },
        { $push: { intial_assingees: { $each: secondary_assignees } } }
      );
      return apiResponseHelper.successResponse(res, "new assignees added");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = AcceptOrDeclineTaskController;
