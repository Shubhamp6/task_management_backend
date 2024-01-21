const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const taskOwnerVerifier = async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);

    const task = await TaskModel.findOne({
      _id: taskId,
      "assignor.id": userId,
    });
    if (!task)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You are not owner of this task"
      );
    next();
  } catch (error) {
    return apiResponseHelper.errorResponse(res, "server error");
  }
};
module.exports = taskOwnerVerifier;
