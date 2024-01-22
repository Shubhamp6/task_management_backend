const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");
const NotificationModel = require("../../model/Notification.model");

const FetchNotificationsController = [
  async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.user._id);

      const model = NotificationModel,
        query = [],
        afterQuery = [];
      const condition = {
        sentTo: userId,
      };

      const filterCondition = await new ResponseGenratorService(
        req,
        model
      ).getSearchConditions(condition);

      query.push({
        $match: filterCondition,
      });

      afterQuery.push({
        $sort: { createdAt: -1 },
      });
      const notifications = await new ResponseGenratorService(
        req,
        model
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      return apiResponseHelper.successResponseWithData(
        res,
        "Notifications fetched",
        notifications
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchNotificationsController;
