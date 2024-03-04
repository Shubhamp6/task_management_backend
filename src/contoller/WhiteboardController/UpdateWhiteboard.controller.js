const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");
const UserModel = require("../../model/User.model");

const UpdateWhiteboardController = [
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("whiteboard_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const whitebaord = await WhiteboardModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!whitebaord) {
          throw Error("whiteboard id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_whiteboard_id")
    .trim()
    .escape(),

  body("name")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("whiteboard_name_required"),

  check("shared_with.*.id")
    .optional()
    .custom(async (val, { req }) => {
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
      var shared_with = [];
      if (data.shared_with) shared_with = data.shared_with;
      const updatedData = {
        shared_with: shared_with,
      };
      if (data.name) updatedData["name"] = data.name;
      console.log(updatedData);
      await WhiteboardModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(data.id),
        },
        updatedData
      );
      return apiResponseHelper.successResponse(res, "Whitebaord updated");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = UpdateWhiteboardController;
