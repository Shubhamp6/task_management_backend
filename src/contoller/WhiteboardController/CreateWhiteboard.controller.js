const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");
const UserModel = require("../../model/User.model");

const CreateWhiteboardController = [
  body("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("whiteboard_name_required"),

  check("shared_with.*.id")
    .custom(async (val, { req }) => {
      console.log(val)
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("user id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_user_id")
    .trim(),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const data = req.body;
      data["creator"] = {
        id: mongoose.Types.ObjectId(req.user._id),
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        employee_code: req.user.employee_code,
      };
      console.log(data);
      await WhiteboardModel.create(data);
      return apiResponseHelper.successResponse(res, "new whitebaord created");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = CreateWhiteboardController;
