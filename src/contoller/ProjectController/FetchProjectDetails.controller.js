const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");
const ProjectModel = require("../../model/Project.model");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const mongoose = require("mongoose");
const { query } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");

const FetchProjectDetailsController = [
  query("id")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("project_id_required"),
  PayloadValidatorMiddleware,
  async (req, res) => {
    try {
      const project = await ProjectModel.findById(mongoose.Types.ObjectId(req.query.id));
      return apiResponseHelper.successResponseWithData(
        res,
        "project details fetched",
        project
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = FetchProjectDetailsController;
