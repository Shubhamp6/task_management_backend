const apiResponseHelper = require("../utils/apiResponse.helper");
const LeaveType = require("../model/Leave_type.model");

const GetLeaveCount = async (leavetype, result) => {
	const leavetype = req;

	const data = await LeaveType.find({ name: leavetype });
	console.log(data);
};

module.exports = GetLeaveCount;
