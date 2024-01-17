const { body, check, query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");
const { default: mongoose } = require("mongoose");
const { PRIORITIES } = require("../../utils/constants/common.constants");
const ProjectModel = require("../../model/Project.model");
const UploadFileService = require("../../services/UploadFile.service");
const TaskModel = require("../../model/Task.model");

const UpdateTaskController = [
  UploadFileService.any("attachmentFiles"),
  query("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task_id_required")
    .trim()
    .escape(),
  body("name")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_name_required")
    .trim()
    .escape(),

  body("description")
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
    .optional()
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
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task start date required!")
    .trim()
    .escape(),
  body("due_date")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("task due date required!")
    .trim()
    .escape(),
  body("due_time")
    .optional()
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

  body("assignor")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("assignor_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        console.log(1);
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
    .trim(),
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
    .trim(),
  body("reporter.id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("reporter_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (
          !user ||
          user.first_name != req.body.reporter.first_name ||
          user.last_name != req.body.reporter.last_name
        ) {
          throw Error("reporter not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_reporter_id")
    .trim(),
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
      const upadateData = matchData(req.body);

      if (req.files.length) {
        const attachmentFiles = req.files;

        const attachments = attachmentFiles.map((attachment) => {
          return (
            req.protocol +
            "://" +
            req.get("host") +
            "/attachments/" +
            attachment.filename
          );
        });
        upadateData.attachments = attachments;
      }

      await TaskModel.findOneAndupdate({ _id: taskId }, upadateData);

      return apiResponseHelper.successResponse(
        res,
        "task data succeffuly updated"
      );
    } catch (e) {
      return apiResponseHelper.errorResponse(res, e.message);
    }
  },
];

module.exports = UpdateTaskController;
