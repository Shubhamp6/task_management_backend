const express = require("express");
const FetchCalendarDataController = require("../contoller/CalendarContorller/FetchCalendarData.controller");


const calendarRoutes = express();

calendarRoutes.get("/", FetchCalendarDataController);

module.exports = calendarRoutes;
