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
      const task = await TaskModel.findOneById(
        mongoose.Types.ObjectId(req.query.id)
      );
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
