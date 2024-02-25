const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");
const MindMapModel = require("../../model/MindMap.model");

const FetchMindMapController = [
  query("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mindmap_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const whitebaord = await MindMapModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!whitebaord) {
          throw Error("mindmap id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_mindmap_id")
    .trim()
    .escape(),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const mindmapId = mongoose.Types.ObjectId(req.query.id),
        userId = mongoose.Types.ObjectId(req.user._id);
      const mindmap = await MindMapModel.aggregate([
        {
          $match: {
            $and: [
              { _id: mindmapId },
              { $or: [{ "creator.id": userId }, { "shared_with.id": userId }] },
            ],
          },
        },
      ]);

      if (!mindmap)
        return apiResponseHelper.notFoundResponse(res, "mindmap not found");
      return apiResponseHelper.successResponseWithData(
        res,
        "Mindmap fetched successfuly",
        mindmap
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchMindMapController;
