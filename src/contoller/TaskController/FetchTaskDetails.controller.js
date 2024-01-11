const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");

const FetchTaskDetailsController = [
  query("id")
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
    .trim(),
  ,
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      const task = await TaskModel.find({
        _id: mongoose.Types.ObjectId(req.query.id),
        $or: [
          { "initial_assignees.id": userId },
          { "assignor.id": userId },
          { "assignees_working.id": userId },
          { "assignees_not_working.id": userId },
          { "repoter.id": userId },
        ],
      });
      return apiResponseHelper.successResponseWithData(
        res,
        "task details fetched",
        task
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchTaskDetailsController;
