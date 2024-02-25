const express = require("express");
const CreateMindMapController = require("../contoller/MindMapController/CreateMindMap.controller");
const FetchMindMapListController = require("../contoller/MindMapController/FetchMindMapList.controller");
const UpdateMindMapController = require("../contoller/MindMapController/UpdateMindMap.controller");
const DeleteMindMapController = require("../contoller/MindMapController/DeleteMindMap.controller");
const CreateMindMapNodeController = require("../contoller/MindMapController/MindMapNodeController/CreateMindMapNode.controller");

const mindMapRoutes = express();

mindMapRoutes.post("/", CreateMindMapController);
mindMapRoutes.get("/list", FetchMindMapListController);
mindMapRoutes.patch("/", UpdateMindMapController);
mindMapRoutes.delete("/", DeleteMindMapController);

mindMapRoutes.post("/node", CreateMindMapNodeController);

module.exports = mindMapRoutes;
