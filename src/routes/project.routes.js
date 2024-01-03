const express = require("express");

const tokenVerifier = require("../middleware/tokenVerifiers.middleware");
const CreateProjectController = require("../contoller/ProjectController/CreateProject.controller");
const FetchProjectsController = require("../contoller/ProjectController/FetchProjects.controller");

const projectRoutes = express();

projectRoutes.post("/", CreateProjectController);
projectRoutes.get("/", FetchProjectsController);

module.exports = projectRoutes;
