const { query } = require("express-validator");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const TaskModel = require("../../model/Task.model");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const { TASK_FETCH_TYPE } = require("../../utils/constants/common.constants");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");


const FetchTasksController = [
  query("taskFetchType")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_fetch_type_required"),
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const user_id = mongoose.Types.ObjectId(req.user._id);
      const taskFetchType = req.query.taskFetchType;
      const model = TaskModel,
        query = [],
        afterQuery = [];
      var condition = {};
      if (taskFetchType == TASK_FETCH_TYPE.myTasks) {
        condition = { $or: [{ assingnees: user_id }, { repoter: user_id }] };
      } else {
        condition = { assignor: user_id };
      }
      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);
      query.push({
        $match: filterCondition,
      });

      afterQuery.push({
        $project: {
          name: 1,
          due_date: 1,
          priority: 1,
        },
      });

      const tasks = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      return apiResponseHelper.successResponseWithData(
        res,
        "tasks list fetched",
        tasks
      );
    } catch (e) {
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchTasksController;
