const express = require("express");
const CreateWhiteboardController = require("../contoller/WhiteboardController/CreateWhiteboard.controller");
const FetchWhiteboardController = require("../contoller/WhiteboardController/FetchWhiteboard.controller");
const FetchWhiteboardListController = require("../contoller/WhiteboardController/FetchWhiteboardList.controller");
const UpdateWhiteboardController = require("../contoller/WhiteboardController/UpdateWhiteboard.controller");
const DeleteWhiteboardController = require("../contoller/WhiteboardController/DeleteWhiteboard.controller");
const CreateStickyNoteController = require("../contoller/WhiteboardController/StickyNoteController/CreateStickyNote.controller");
const DeleteStickyNoteController = require("../contoller/WhiteboardController/StickyNoteController/DeleteStickyNote.controller");
const UpdateStickyNoteController = require("../contoller/WhiteboardController/StickyNoteController/UpdateStickyNote.controller");

const whiteboardRoutes = express();

whiteboardRoutes.post("/", CreateWhiteboardController);
whiteboardRoutes.get("/", FetchWhiteboardController);
whiteboardRoutes.get("/list", FetchWhiteboardListController);
whiteboardRoutes.patch("/", UpdateWhiteboardController);
whiteboardRoutes.delete("/", DeleteWhiteboardController);

whiteboardRoutes.post("/sticky-note", CreateStickyNoteController);
whiteboardRoutes.delete("/sticky-note", DeleteStickyNoteController);
whiteboardRoutes.patch("/sticky-note", UpdateStickyNoteController);

module.exports = whiteboardRoutes;
