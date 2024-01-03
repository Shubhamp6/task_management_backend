const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const ProjectModel = require("../../model/Project.model");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");



const FetchProjectsController = [
  async (req, res) => {
    try {
      const user_id = mongoose.Types.ObjectId(req.user._id);

      const model = ProjectModel,
        query = [],
        afterQuery = [];
      const condition = { $or: [{ head: user_id }, { members: user_id }] };

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
          head: 1,
        },
      });

      const projects = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      return apiResponseHelper.successResponseWithData(
        res,
        "projects list fetched",
        projects
      );
    } catch (e) {
      console.log(e)
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchProjectsController;
