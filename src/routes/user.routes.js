const express = require("express");

const CreateUesrController = require("../contoller/UserController/Register.controller");
const userRoutes = express();

userRoutes.post("/", CreateUesrController);

module.exports = userRoutes;
