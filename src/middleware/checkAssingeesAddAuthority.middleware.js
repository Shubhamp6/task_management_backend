const { default: mongoose } = require("mongoose");
const apiResponseHelper = require("../utils/apiResponse.helper.js");
const TaskModel = require("../model/Task.model.js");

const checkAssingeesAddAuthority = () => {
  async (req, res, next) => {
    const userId = mongoose.Types.ObjectId(req.user._id),
      taskId = mongoose.Types.ObjectId(req.body.id);

    const user = await TaskModel.findOneAndUpdate(
      {
        _id: taskId,
        assingees_with_add_authority: userId,
      },
      { $pull: { assingees_with_add_authority: userId } }
    );
    if (!user)
      return apiResponseHelper.unauthorizedResponse(
        res,
        "You cannot add assingees"
      );
    next();
  };
};
module.exports = checkAssingeesAddAuthority;
