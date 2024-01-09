const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const UserModel = require("../../model/User.model");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");

const FetchUsersController = [
  async (req, res) => {
    try {
      const model = UserModel,
        query = [],
        afterQuery = [];
      const condition = {};

      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);

      query.push({
        $match: filterCondition,
      });

      const users = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      return apiResponseHelper.successResponseWithData(
        res,
        "user list fetched",
        users
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchUsersController;
