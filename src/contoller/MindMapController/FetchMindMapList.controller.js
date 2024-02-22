const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const MindMapModel = require("../../model/MindMap.model");

const FetchMindMapListController = [
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);

      const model = MindMapModel,
        query = [],
        afterQuery = [];
      const condition = {
        $or: [{ "creator.id": userId }, { "shared_with.id": userId }],
      };

      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);

      query.push({
        $match: filterCondition,
      });

      const mindmaps = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      if (!mindmaps.result.length)
        return apiResponseHelper.notFoundResponse(res, "mindmaps not found");
      return apiResponseHelper.successResponseWithData(
        res,
        "mindmaps list fetched successfuly",
        mindmaps
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchMindMapListController;
