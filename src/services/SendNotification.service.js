const Notification = require("../model/Notification.model");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../utils/apiResponse.helper");
const Users = require("../model/User.model")
const { NOTIFICATION_TYPE } = require("../utils/constants/common.constants")


const SendNotifcationService =
    async (req, res) =>
    {
        try
        {
            const { senderId, senderName, recipients, notificationType, contentId, message } = req.leaveInfo;
            let recipientIDs = [];
            // if (notificationType == NOTIFICATION_TYPE.general)
            // {
            //     recipientIDs = await Users.find({}, { _id: 1 });

            // }
            // else
            // {
            recipientIDs = notificationType == NOTIFICATION_TYPE.general ? [] : recipients;
            // }
            const createNotification = {};
            createNotification["notificationType"] = notificationType,
                createNotification["senderId"] = senderId,
                createNotification["recipients"] = recipientIDs,
                createNotification["message"] = message
            createNotification["contentId"] = contentId
            createNotification["senderName"] = senderName;


            // Make sure all recipients exist in the database
            if (notificationType != NOTIFICATION_TYPE.general)
            {
                const existingRecipients = await Users.find({ _id: { $in: recipientIDs } });
                if (existingRecipients.length !== recipientIDs.length)
                {
                    return apiResponseHelper.notFoundResponse(res, msg = "one or more receiver is not found!")
                }
            }

            // Create a new notification and save 

            const notification = new Notification(createNotification);
            await notification.save();

        } catch (error) {
            throw Error(error)
            // return apiResponseHelper.errorResponse(res, (msg = "request is not sent!"));
        }
    };

module.exports = SendNotifcationService;
