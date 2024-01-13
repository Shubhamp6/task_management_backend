const express = require("express");
const FetchNotificationsController = require("../contoller/NotificationController/FetchNotifications.controller");

const notificationRoutes = express();

notificationRoutes.get("/list", FetchNotificationsController);

module.exports = notificationRoutes;
