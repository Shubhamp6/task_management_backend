const Leavecount = require("../model/Leavecount.model");
const LeaveType = require("../model/Leave_type.model");
const apiResponseHelper = require("../utils/apiResponse.helper");


const GenereateLeaveCountMiddleware =
    async (req, res) =>
    {
        try
        {

            const year = new Date().getFullYear();
            const month = new Date().getMonth();
            const leavecount = await Leavecount.create({ userId, leaveCountYear: year });
            const leavesType = {};
            const findLeave = await LeaveType.find({}, { leaveType: 1, total_allowed: 1 });
            for (let i = 0; i < findLeave.length; i++)
            {
                leavesType[findLeave[i].leaveType] = findLeave[i].total_allowed;
            }

            let k = 0;
            for (let i = month; i < 12; i++)
            {
                if (i == 0)
                {
                    var leavesArray = [];
                    Object.entries(leavesType).forEach(([key, value]) =>
                    {
                        leavesArray.push({ leaveType: key, leaveBalance: value, leaveTaken: 0 })
                    })
                    leavecount.annualLeaves[i] = {
                        month: i,
                        leaves: leavesArray,

                    };
                    await leavecount.save();

                }
                else
                {
                    if (k == 0)
                    {
                        var leavesArray = [{}];
                        Object.entries(leavesType).forEach(([key, value]) =>
                        {
                            leavesArray.push({ leaveType: key, leaveBalance: 0, leaveTaken: 0 })
                        })
                        for (k = 0; k < month; k++)
                        {
                            leavecount.annualLeaves[k] = {
                                month: k,
                                leaves: leavesArray,
                            };
                        }
                        await leavecount.save();

                    }

                    var leavesArray = [];
                    let lastMonthCount = 0;
                    Object.entries(leavesType).forEach(([key, value]) =>
                    {
                        leavecount.annualLeaves[i - 1].leaves.forEach((obj) =>
                        {
                            if (obj.leaveType === key)
                            {
                                lastMonthCount = obj.leaveBalance;
                                return false;
                            }
                        })
                        leavesArray.push({
                            leaveType: key, leaveBalance: lastMonthCount + value, leaveTaken: 0
                        })
                    })
                    leavecount.annualLeaves[i] = {
                        month: i,
                        leaves: leavesArray,
                    };
                    await leavecount.save();
                }

            }
            await leavecount.save()
        }
        catch (error)
        {
            return apiResponseHelper.errorResponse(res, msg = "process to create leavecount failed")
        }



    };


module.exports = GenereateLeaveCountMiddleware;
