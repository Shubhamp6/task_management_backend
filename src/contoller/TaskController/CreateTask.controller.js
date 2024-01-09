const { body, check } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");
const { default: mongoose } = require("mongoose");
const { PRIORITIES } = require("../../utils/constants/common.constants");
const ProjectModel = require("../../model/Project.model");
const UploadFileService = require("../../services/UploadFile.service");
const TaskModel = require("../../model/Task.model");

const CreateTaskController = [
  UploadFileService.any("attachmentFiles"),
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

  body("project")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_id_required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const project = await ProjectModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!project) {
          throw Error("projct id not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_project_id")
    .trim(),

  body("priority")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task priority is required!")
    .bail()
    .custom((val) => {
      if (!Object.values(PRIORITIES).includes(val)) {
        throw Error("bad_priority_selcetion");
      }
      return true;
    })
    .trim()
    .escape(),

  body("start_date")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task start date required!")
    .trim()
    .escape(),
  body("due_date")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task due date required!")
    .trim()
    .escape(),
  body("due_time")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task due time required!")
    .trim()
    .escape(),

  check("attachmentFiles")
    .optional()
    .custom((value, { req }) => {
      if (req.files.length == 0) {
        return false;
      } else {
        return true;
      }
    })
    .withMessage("Attachments required"),

  body("assignor.id")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("assignor_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        console.log(req.body);
        if (
          !user ||
          user.first_name != req.body.assignor.first_name ||
          user.last_name != req.body.assignor.last_name
        ) {
          throw Error("assignor not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_assignor_id")
    .trim()
    .escape(),
  body("initial_assignees.*.id")
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("initial assignees not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_assignee_id")
    .trim()
    .escape(),
  body("repoter.id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("repoter_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (
          !user ||
          user.first_name != req.body.repoter.first_name ||
          user.last_name != req.body.repoter.last_name
        ) {
          throw Error("repoter not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_repoter_id")
    .trim()
    .escape(),

  body("parent_task")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("parent_task_id_required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const project = await ProjectModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!project) {
          throw Error("project not valid");
        }
      }
      return val;
    })
    .withMessage("parent_task_id")
    .trim(),

  PayloadValidatorMiddleware,

  async (req, res, next) => {
    try {
      const {
        name,
        discription,
        project,
        priority,
        start_date,
        due_date,
        due_time,
        assignor,
        initial_assignees,
        repoter,
        parent_task,
      } = req.body;

      const assingees_with_add_authority = initial_assignees;

      if (!assignor)
        assignor = mongoose.Types.ObjectId({
          id: mongoose.Types.ObjectId(req.user._id),
          first_name: req.user.first_name,
          last_name: req.user.last_name,
        });

      var attachments;
      if (req.files) {
        const attachmentFiles = req.files;

        attachments = attachmentFiles.map((attachment) => {
          return (
            req.protocol +
            "://" +
            req.get("host") +
            "/attachments/" +
            attachment.filename
          );
        });
      }

      await TaskModel.create({
        name,
        discription,
        project,
        priority,
        attachments,
        start_date,
        due_date,
        due_time,
        assignor,
        initial_assignees,
        assingees_with_add_authority,
        repoter,
        parent_task,
      });

      return apiResponseHelper.successResponse(res, "task succeffuly created");
    } catch (e) {
      return apiResponseHelper.errorResponse(res, e.message);
    }
  },
];

module.exports = CreateTaskController;
