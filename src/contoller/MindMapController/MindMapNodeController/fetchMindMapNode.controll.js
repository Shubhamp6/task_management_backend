// const MindMapNodeModel = require("../../../model/MindMapNode.model");
const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const { COLORS } = require("../../../utils/constants/common.constants");

const FetchMindMapNodeController = [
  query("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mind_map_node_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const mindMapNode = await MindMapNodeModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!mindMapNode) {
          throw Error("mind map not id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_mind_map_node_id")
    .trim()
    .escape(),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const mindMapNodeId = mongoose.Types.ObjectId(req.query.id);
      const mindMapNode = await MindMapNodeModel.find({ _id: mindMapNodeId });
      return apiResponseHelper.successResponseWithData(
        res,
        "mind map fetched",
        mindMapNode
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchMindMapNodeController;
