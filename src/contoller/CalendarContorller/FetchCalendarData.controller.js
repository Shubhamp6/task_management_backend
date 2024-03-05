const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");
const { COLORS } = require("../../utils/constants/common.constants");
const TaskModel = require("../../model/Task.model");

const FetchCalendarDataController = [
  async (req, res) => {
    try {
      const user_id = mongoose.Types.ObjectId(req.user._id);
      const model = TaskModel,
        query = [],
        afterQuery = [];
      const condition = {
        $or: [
          { "assignees_working.id": user_id },
          { "reporter.id": user_id },
          { "assignor.id": user_id },
        ],
      };

      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);
      query.push({
        $match: filterCondition,
      });
      afterQuery.push({
        $project: {
          _id: 1,
          eventName: "$name",
          from: "$start_date",
          to: "$due_date",
          background: {
            $cond: {
              if: {
                $eq: ["$assignor.id", user_id],
              },
              then: COLORS.blue,
              else: COLORS.green,
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
        "task list fetched",
        tasks
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchCalendarDataController;
