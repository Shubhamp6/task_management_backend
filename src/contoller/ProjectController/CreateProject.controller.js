const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");
const { default: mongoose } = require("mongoose");
const { PROJECT_TYPES } = require("../../utils/constants/common.constants");
const ProjectModel = require("../../model/Project.model");

const CreateProjectController = [
  body("name")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_name_required")
    .trim()
    .escape(),

  body("discription")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_description_required")
    .trim()
    .escape(),

  body("type")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project type is required!")
    .bail()
    .custom((val) => {
      if (!Object.values(PROJECT_TYPES).includes(val)) {
        throw Error("bad_project_type_selcetion");
      }
      return val;
    })
    .trim()
    .escape(),

  body("due_date")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project due date required!")
    .trim()
    .escape(),

  body("head.id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_head_required")
    .bail()
    .custom(async (val, { req }) => {
      console.log(val);
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        console.log(1);
        if (
          !user ||
          user.first_name != req.body.head.first_name ||
          user.last_name != req.body.head.last_name
        ) {
          throw Error("head not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_head_id")
    .trim()
    .escape(),

  check("members.*.id")
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("members not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_member_id")
    .trim(),

  PayloadValidatorMiddleware,

  async (req, res, next) => {
    try {
      const projectDetails = req.body;
      console.log(projectDetails);
      if (!projectDetails.head)
        projectDetails.head = {
          id: mongoose.Types.ObjectId(req.user._id),
          first_name: req.user.first_name,
          last_name: req.user.last_name,
        };
      await ProjectModel.create(projectDetails);

      return apiResponseHelper.successResponse(
        res,
        "project succeffuly created"
      );
    } catch (e) {
      return apiResponseHelper.errorResponse(res, e.message);
    }
  },
];

module.exports = CreateProjectController;
