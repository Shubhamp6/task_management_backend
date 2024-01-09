const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const TaskModel = require("../../model/Task.model");

const FetchTaskDetailsController = [
  query("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_id_required"),
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);
      const task = await TaskModel.find({
        _id: mongoose.Types.ObjectId(req.query.id),
        $or: [
          { initial_assignees: userId },
          { assignor: userId },
          { assignees_working: userId },
          { assignees_not_working: userId },
          { repoter: userId },
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
