const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const checkAssingeesAddAuthority = () => {
  async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);

    const user = await TaskModel.findOne({
      _id: taskId,
      assignor: userId,
    });
    if (!user)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You are not owner of this task"
      );
    next();
  };
};
module.exports = checkAssingeesAddAuthority;
