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
    .withMessage("task_fetch_type_required")
    .bail()
    .custom((val) => {
      if (!Object.values(TASK_FETCH_TYPE).includes(val)) {
        throw Error("bad_task_fetch_type");
      }
      return true;
    })
    .trim()
    .escape(),
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
        condition = {
          $or: [
            { "assignees_working.id": user_id },
            { "assignees_not_working.id": user_id },
            { "reporter.id": user_id },
          ],
        };
      } else {
        condition = { "assignor.id": user_id };
      }
      console.log(condition);
      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);
      query.push({
        $match: filterCondition,
      });
      if (taskFetchType == TASK_FETCH_TYPE.myTasks)
        afterQuery.push({
          $project: {
            _id: 1,
            priority: 1,
            name: 1,
            due_date: 1,
            due_time: 1,
            isAccepted: {
              $cond: {
                if: {
                  $in: [user_id, "$assignees_not_working.id"],
                },
                then: false,
                else: true,
              },
            },
          },
        });
      console.log(afterQuery);
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
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchTasksController;
