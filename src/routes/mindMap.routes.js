const express = require("express");
const CreateMindMapController = require("../contoller/MindMapController/MindMapNodeController/CreateMindMapNode.controller");
const FetchMindMapNodeController = require("../contoller/MindMapController/MindMapNodeController/fetchMindMapNode.controll");

const mindMapRoutes = express();

mindMapRoutes.post("/", CreateMindMapController);
mindMapRoutes.get("/", FetchMindMapNodeController);

module.exports = mindMapRoutes;
