const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const checkAcceptOrDeclinePremission = () => {
  async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);

    const task = await TaskModel.findOneAndUpdate(
      {
        _id: taskId,
        "initial_assingees.id": userId,
      },
    );
    if (!task)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You cannot accept or decline this task"
      );
    next();
  };
};
module.exports = checkAcceptOrDeclinePremission;
