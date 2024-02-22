// const MindMapNodeModel = require("../../../model/MindMapNode.model");
const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const { COLORS } = require("../../../utils/constants/common.constants");

const CreateMindMapContrdalksfjoller = [
  body("content")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mind_map_node_content_required")
    .bail()
    .trim()
    .escape(),
  body("shape")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mind_map_node_shape_required")
    .bail()
    .trim()
    .escape(),
  body("color")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mind_map_node_color_required")
    .bail()
    .custom((val) => {
      if (!Object.values(COLORS).includes(val)) {
        throw Error("bad_mind_map_node_color_selection");
      }
      return true;
    })
    .trim()
    .escape(),

  body("leftChildren.*")
    .optional()
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
  body("rigthChildren.*")
    .optional()
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
      const data = req.body;
      await MindMapNodeModel.create(data);
      return apiResponseHelper.successResponse(
        res,
        "new mind map node created"
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = CreateMindMapContrdalksfjoller;
