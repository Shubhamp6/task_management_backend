const express = require("express");
const CreateMindMapController = require("../contoller/MindMapController/CreateMindMap.controller");
const FetchMindMapListController = require("../contoller/MindMapController/FetchMindMapList.controller");
const UpdateMindMapController = require("../contoller/MindMapController/UpdateMindMap.controller");
const DeleteMindMapController = require("../contoller/MindMapController/DeleteMindMap.controller");
const CreateMindMapNodeController = require("../contoller/MindMapController/MindMapNodeController/CreateMindMapNode.controller");
const FetchMindMapController = require("../contoller/MindMapController/FetchMindMap.controller");
const UpdateMindMapNodeController = require("../contoller/MindMapController/MindMapNodeController/UpdateMindMapNode.controller");
const DeleteMindMapNodeController = require("../contoller/MindMapController/MindMapNodeController/DeleteMindMapNode.controller");

const mindMapRoutes = express();

mindMapRoutes.post("/", CreateMindMapController);
mindMapRoutes.get("/list", FetchMindMapListController);
mindMapRoutes.get("/", FetchMindMapController);
mindMapRoutes.patch("/", UpdateMindMapController);
mindMapRoutes.delete("/", DeleteMindMapController);

mindMapRoutes.post("/node", CreateMindMapNodeController);
mindMapRoutes.patch("/node", UpdateMindMapNodeController);
mindMapRoutes.delete("/node", DeleteMindMapNodeController);

module.exports = mindMapRoutes;
