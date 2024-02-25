const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const MindMapModel = require("../../../model/MindMap.model");

const DeleteMindMapNodeController = [
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mindmap_node_id_required"),
  body("mindmap")
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
      const data = req.body;
      await MindMapModel.updateById(mongoose.Types.ObjectId(data.mindmap), {
        $pull: { nodes: { id: data.id } },
        $pull: { nodes: { parentId: data.id } },
        $pull: { edges: { to: data.id } },
        $pull: { edges: { from: data.id } },
      });
      return apiResponseHelper.successResponse(res, "new mindmap node deleted");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = DeleteMindMapNodeController;
