const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const mongoose = require("mongoose");
const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../model/Whiteboard.model");
const UserModel = require("../../model/User.model");
const MindMapModel = require("../../model/MindMap.model");

const UpdateMindMapController = [
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

  body("name")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mindmap_name_required"),

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
      await MindMapModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(data.id),
        },
        updatedData
      );
      return apiResponseHelper.successResponse(res, "Mindmap updated");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = UpdateMindMapController;
