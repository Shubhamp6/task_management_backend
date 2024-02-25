const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const MindMapModel = require("../../model/MindMap.model");

const DeleteMindMapController = [
  body("id")
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
      const mindmapId = mongoose.Types.ObjectId(req.body.id),
        userId = mongoose.Types.ObjectId(req.user._id);
      const mindmap = await MindMapModel.findOneAndDelete({
        _id: mindmapId,
        "creator.id": userId,
      });

      if (!mindmap)
        return apiResponseHelper.notFoundResponse(res, "mindmap not found");
      return apiResponseHelper.successResponse(res, "mindmap deleted");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = DeleteMindMapController;
