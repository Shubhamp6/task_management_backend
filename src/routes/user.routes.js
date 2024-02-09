const express = require("express");

const CreateUesrController = require("../contoller/UserController/Register.controller");
const FetchUsersController = require("../contoller/UserController/FetchUsers.controllers");
const userRoutes = express();

userRoutes.post("/", CreateUesrController);
userRoutes.get("/fetch-by-id", CreateUesrController);
userRoutes.get("/", FetchUsersController);

module.exports = userRoutes;
