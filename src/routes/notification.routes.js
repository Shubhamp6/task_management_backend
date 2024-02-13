const express = require("express");
const FetchNotificationsController = require("../contoller/NotificationController/FetchNotifications.controller");
const SendChatNotificationsController = require("../contoller/NotificationController/SendChatNotifications.controller");

const notificationRoutes = express();

notificationRoutes.get("/list", FetchNotificationsController);
notificationRoutes.post("/chat", SendChatNotificationsController);

module.exports = notificationRoutes;
