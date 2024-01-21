const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const StickyNoteModel = require("../../../model/StickyNote.model");

const DeleteStickyNoteController = [
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

  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const stickyNoteId = mongoose.Types.ObjectId(req.body.id);
      const stickyNote = await StickyNoteModel.findOneAndDelete({
        _id: stickyNoteId,
      });
      if (!stickyNote)
        return apiResponseHelper.notFoundResponse(res, "sticky note not found");
      return apiResponseHelper.successResponse(res, "sticky note deleted");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = DeleteStickyNoteController;
