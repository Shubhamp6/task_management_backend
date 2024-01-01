const User = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");

const DeleteUserController = [
	async (req, res) =>
	{
		try
		{
			const filter = { email: req.body.email };
			const results = await User.deleteMany(filter);
			return apiResponseHelper.successResponseWithData(
				res,
				(msg = "User has been deleted"),
				results
			);
		} catch (error)
		{
			return apiResponseHelper.errorResponse(res, msg = "Error in deleting user")
		}
	},
];

module.exports = DeleteUserController;
