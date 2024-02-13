const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");
const NotificationModel = require("../../model/Notification.model");
const { body, check } = require("express-validator");
const SendNotifcationService = require("../../services/SendNotification.service");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");

const SendChatNotificationsController = [
  body("title")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("notification_title_required"),
  body("body")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("notification_body_required"),
  body("sendTo.*")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("user_id_required")
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
    .trim()
    .escape(),
  
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const title = req.body.title,
        body = req.body.body;

      await SendNotifcationService({ title, body }, req.body.sendTo);

      return apiResponseHelper.successResponse(res, "Notification sent");
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = SendChatNotificationsController;
