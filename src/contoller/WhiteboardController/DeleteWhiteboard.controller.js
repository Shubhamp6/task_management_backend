const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");

const CreateWhiteboardController = [
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

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const whiteboardId = mongoose.Types.ObjectId(req.body.id),
        userId = mongoose.Types.ObjectId(req.user._id);
      const whiteboard = await WhiteboardModel.findOneAndDelete({
        _id: whiteboardId,
        "creator.id": userId,
      });

      if (!whiteboard)
        return apiResponseHelper.notFoundResponse(res, "whiteboard not found");
      return apiResponseHelper.successResponse(res, "whiteboard deleted");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = CreateWhiteboardController;
