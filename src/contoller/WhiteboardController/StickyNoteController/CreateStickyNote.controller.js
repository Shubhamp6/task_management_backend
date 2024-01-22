const apiResponseHelper = require("../../../utils/apiResponse.helper");
const _lang = require("../../../utils/lang");
const mongoose = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../../middleware/PayloadValidator.middleware");
const WhiteboardModel = require("../../../model/Whiteboard.model");
const StickyNoteModel = require("../../../model/StickyNote.model");
const { STICKY_NOTES_COLORS } = require("../../../utils/constants/common.constants");

const CreateStickyNoteController = [
  body("description")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("sticky_note_description_required"),
  body("color")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("sticky_note_color_required")
    .bail()
    .custom((val) => {
      if (!Object.values(STICKY_NOTES_COLORS).includes(val)) {
        throw Error("bad_sticky_note_color_selcetion");
      }
      return true;
    })
    .trim()
    .escape(),

  body("whiteboard")
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
      const data = req.body;
      await StickyNoteModel.create(data);
      return apiResponseHelper.successResponse(res, "new sticky note created");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = CreateStickyNoteController;
