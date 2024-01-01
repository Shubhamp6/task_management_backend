const { default: mongoose } = require("mongoose");
const UserModel = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");

const UserEnableOrDisableController = [
  async (req, res) => {
    try {
      console.log(req.requestedUser)
      const result = await UserModel.findByIdAndUpdate(
        req.requestedUser._id,
        { enabled: !req.requestedUser.enabled }
      );
      return apiResponseHelper.successResponse(
        res,
        (msg = "User state changed")
      );
    } catch (error) {
      console.log(error);
      return apiResponseHelper.errorResponse(
        res,
        (msg = "Error in changing user state")
      );
    }
  },
];

module.exports = UserEnableOrDisableController;
