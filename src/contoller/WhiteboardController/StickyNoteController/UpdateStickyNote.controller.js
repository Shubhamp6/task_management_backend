const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const StickyNoteModel = require("../../../model/StickyNote.model");

const UpdateStickyNoteController = [
  body("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("sticky_note_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const stickyNote = await StickyNoteModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!stickyNote) {
          throw Error("sticky note id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_sticky_note_id")
    .trim()
    .escape(),
  body("description")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("sticky_note_description_required"),
  body("color")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("sticky_note_color_required"),

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const stickyNoteId = mongoose.Types.ObjectId(req.body.id);
      const data = {};
      if (req.body.description) data["description"] = req.body.description;
      if (req.body.color) data["color"] = req.body.color;
      await StickyNoteModel.findOneAndUpdate({ _id: stickyNoteId }, data);
      return apiResponseHelper.successResponse(res, "new sticky note created");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = UpdateStickyNoteController;
