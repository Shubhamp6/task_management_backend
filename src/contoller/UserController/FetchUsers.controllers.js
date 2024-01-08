const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const UserModel = require("../../model/User.model");

const FetchUsersController = [
  async (req, res) => {
    try {
      const users = await UserModel.find({});
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
