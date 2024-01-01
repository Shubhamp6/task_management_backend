const express = require("express");
const multer = require("multer");

const UserFetchController = require("../contoller/UserController/UserFetch.controller");
const UpdateUserController = require("../contoller/UserController/UpdateUser.controller");
const CreateUesrController = require("../contoller/UserController/Register.controller");
const DeleteUserController = require("../contoller/UserController/DeleteUser.controller");
const UserProfileController = require("../contoller/UserController/UserProfile.controller");
const UserFetchByTokenController = require("../contoller/UserController/UserFetchByToken.controller");
const UploadImageController = require("../contoller/UserController/UploadImage.controller");
const userVerifier = require("../middleware/userVerifier.middleware");
const moduleAccessMiddleware = require("../middleware/moduleAccess.middleware");
const { USER_ROLES } = require("../utils/constants/common.constants");
const UserEnableOrDisableController = require("../contoller/UserController/UserEnableOrDisable.controller");

const userRoutes = express();
const upload = multer({ storage: multer.memoryStorage() });

userRoutes.get("/", UserFetchController);
userRoutes.get(
  "/fetch-by-id",
  moduleAccessMiddleware([
    USER_ROLES.admin,
    USER_ROLES.hr,
    USER_ROLES.employee,
  ]),
  userVerifier,
  UserProfileController
);
userRoutes.get("/fetch-by-token", UserFetchByTokenController);
userRoutes.post(
  "/",
  moduleAccessMiddleware([USER_ROLES.admin, USER_ROLES.hr]),
  CreateUesrController
);
userRoutes.patch(
  "/",
  moduleAccessMiddleware([USER_ROLES.admin, USER_ROLES.hr]),
  userVerifier,
  UpdateUserController
);
userRoutes.patch(
  "/enable-or-disable",
  moduleAccessMiddleware([USER_ROLES.admin, USER_ROLES.hr]),
  userVerifier,
  UserEnableOrDisableController
);
// userRoutes.post("/delete", DeleteUserController);//disbaled for now

userRoutes.post(
  "/upload-image",
  upload.single("filename"),
  UploadImageController
);

module.exports = userRoutes;
