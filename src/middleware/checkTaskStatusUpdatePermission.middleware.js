const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const checkTaskStatusUpdatePermission = async (req, res, next) => {
  try {
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);

    const task = await TaskModel.findOneAndUpdate(
      { _id: taskId },
      { $or: [{ "assingees_working.id": userId }, { "assignor.id": userId }] }
    );
    if (!task)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You cannot add assingees"
      );
    next();
  } catch (error) {
    return apiResponseHelper.errorResponse(res, "server error");
  }
};
module.exports = checkTaskStatusUpdatePermission;
