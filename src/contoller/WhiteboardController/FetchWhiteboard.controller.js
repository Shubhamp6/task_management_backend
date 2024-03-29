const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");

const FetchWhiteboardController = [
  query("id")
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
      const whiteboardId = mongoose.Types.ObjectId(req.query.id),
        userId = mongoose.Types.ObjectId(req.user._id);
      const whiteboard = await WhiteboardModel.aggregate([
        {
          $match: {
            $and: [
              { _id: whiteboardId },
              { $or: [{ "creator.id": userId }, { "shared_with.id": userId }] },
            ],
          },
        },
        {
          $lookup: {
            from: "stickynotes",
            localField: "_id",
            foreignField: "whiteboard",
            as: "stickynotes",
          },
        },
      ]);

      if (!whiteboard)
        return apiResponseHelper.notFoundResponse(res, "whiteboard not found");
      return apiResponseHelper.successResponseWithData(
        res,
        "whiteboard fetched successfuly",
        whiteboard
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchWhiteboardController;
