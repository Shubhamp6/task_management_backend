const express = require("express");

const CreateUesrController = require("../contoller/UserController/Register.controller");
const FetchUsersController = require("../contoller/UserController/FetchUsers.controllers");
const UserFetchByTokenController = require("../contoller/UserController/UserFetchByToken.controller");
const userRoutes = express();

userRoutes.post("/", CreateUesrController);
userRoutes.get("/fetch-by-token", UserFetchByTokenController);
userRoutes.get("/", FetchUsersController);

module.exports = userRoutes;
