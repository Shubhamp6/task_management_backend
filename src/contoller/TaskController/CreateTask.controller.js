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

  body("assignor")
    .optional()
    .notEmpty({ ignore_whitespace: true })
    .withMessage("assignor_id_required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("user not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_assignor_id")
    .trim(),
  body("assignees")
    .custom(async (val) => {
      val.forEach(async (el) => {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(el),
        });
        if (!user) {
          throw Error("assignee not valid");
        }
      });
      return val;
    })
    .withMessage("invalid_assignee_id")
    .trim(),
  body("repoter")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("repoter_id_required")
    .bail()
    .custom(async (val) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
        });
        if (!user) {
          throw Error("user not valid");
        }
      }
      return val;
    })
    .withMessage("invalid_repoter_id")
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
      const {
        name,
        discription,
        project,
        priority,
        start_date,
        due_date,
        due_time,
        assignor,
        assignees,
        repoter,
        parent_task,
      } = req.body;

      if (!assignor) assignor = mongoose.Types.ObjectId(req.user._id);

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
        assignees,
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
