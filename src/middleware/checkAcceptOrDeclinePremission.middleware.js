const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const checkAcceptOrDeclinePremission = async (req, res, next) => {
  try{
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);
    const task = await TaskModel.findOne(
      {
        _id: taskId,
        "initial_assignees.id": userId,
      },
    );
    console.log(task)
    if (!task)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You cannot accept or decline this task"
      );
    next();
  }catch(error){
    console.log(error);
    return apiResponseHelper.errorResponse(res,"server error");
  }
};
module.exports = checkAcceptOrDeclinePremission;
