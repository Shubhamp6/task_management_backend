const { default: mongoose } = require("mongoose");
const User = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const { USER_ROLES } = require("../../utils/constants/common.constants");
const ResponseGenratorService = require("../../services/ResponseGenrator.service");
const UserModel = require("../../model/User.model");

const UserFetchController = [
  async (req, res) => {
    try {
      const { role } = req.query;
      const condition = {};
      
      if (
        role &&
        role != "" &&
        !isNaN(role) &&
        (req.user.role === USER_ROLES.admin || req.user.role === USER_ROLES.hr)
      ) {
        condition["role"] = parseInt(role);
      } else if (
        !(req.user.role === USER_ROLES.admin || req.user.role === USER_ROLES.hr)
      ) {
        condition["parent_id"] = mongoose.Types.ObjectId(req.user._id);
      }

      // if (req.user.role != USER_ROLES.admin) {
      //   condition["branch"] = mongoose.Types.ObjectId(req.user.branch);
      // }
      
      const modal = UserModel;
      const filterCondition = await new ResponseGenratorService(
        req,
        modal
      ).getSearchConditions(condition);

      const query = [];
      const afterQuery = [];
      query.push({
        $match: filterCondition,
      });

      afterQuery.push({
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      });
      afterQuery.push({
        $unwind: {
          path: "$department",
          preserveNullAndEmptyArrays: true,
        },
      });

      afterQuery.push({
        $project: {
          name: "$name",
          email: "$email",
          employee_id: "$employee_id",
          dob: "$dob",
          role: "$role",
          dob: "$dob",
          department: "$department.name",
          designation: "$designation",
          join_date: "$join_date",
          phone: "$phone",
          phone_emergency: "$phone_emergency",
          enabled: "$enabled",
          profile_url: "$profile_url",
          first_parent: { $first: "$parent_id" },
        },
      });

      afterQuery.push({
        $lookup: {
          from: "users",
          localField: "first_parent",
          pipeline: [{ $project: { name: 1, employee_id: 1 } }],
          foreignField: "_id",
          as: "first_parent",
        },
      });
      afterQuery.push({
        $unwind: {
          path: "$first_parent",
          preserveNullAndEmptyArrays: true,
        },
      });
      const data = await new ResponseGenratorService(
        req,
        modal
      ).getAggrigatedPaginatedResponse(query, afterQuery);

      return apiResponseHelper.successResponseWithData(
        res,
        (msg = "User fetched"),
        data
      );
    } catch (error) {
      console.log(error.stack);
      return apiResponseHelper.errorResponse(res, error.message);
    }
  },
];

module.exports = UserFetchController;
