const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");

const CreateWhiteboardController = [
  body("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("whiteboard_name_required"),
  body("creator.id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("whiteboard_creator_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (
          !user ||
          user.first_name != req.body.creator.first_name ||
          user.last_name != req.body.creator.last_name
        ) {
          throw Error("creator not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_head_id")
    .trim()
    .escape(),

  check("shared_with.*.id")
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
      await WhiteboardModel.create(data);
      return apiResponseHelper.successResponse(res, "new whitebaord created");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = CreateWhiteboardController;
