const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");

const FetchWhiteboardListController = [
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);

      const model = WhiteboardModel,
        query = [],
        afterQuery = [];
      const condition = {
        $or: [{ "creator.id": userId }, { "share_with.id": userId }],
      };

      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);

      query.push({
        $match: filterCondition,
      });

      const whiteboards = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      if (!whiteboards.result.length)
        return apiResponseHelper.notFoundResponse(res, "whiteboards not found");
      return apiResponseHelper.successResponseWithData(
        res,
        "whiteboard list fetched successfuly",
        whiteboards
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchWhiteboardListController;
