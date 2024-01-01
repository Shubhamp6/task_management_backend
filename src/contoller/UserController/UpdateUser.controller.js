const { body, matchedData } = require("express-validator");
const { default: mongoose } = require("mongoose");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const UserModel = require("../../model/User.model");
const { findOneAndUpdate } = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const {
  USER_ROLES,
  USER_UPDATE_TYPE,
} = require("../../utils/constants/common.constants");
const BranchModel = require("../../model/Branch.model");

const UpdateUserController = [
  body("userId").customSanitizer((val, { req }) => {
    if (
      req.requestedUser.role == USER_ROLES.admin ||
      req.requestedUser.role == USER_ROLES.hr
    )
      return val || req.requestedUser._id;

    return req.requestedUser._id;
  }),
  body("password")
    .optional({ nullable: true })
    .custom((val, { req }) => {
      if (
        val &&
        !(
          req.requestedUser.role == USER_ROLES.admin ||
          req.requestedUser.role == USER_ROLES.hr
        )
      ) {
        throw Error("password is not changable");
      }
      return val;
    }),
  body("updateType") // default | taxes| pf | esic | bank_details | salary | parent_id
    .notEmpty({ ignore_whitespace: true })
    .withMessage("updat type is required!")
    .bail()
    .custom((val) => {
      if (!Object.values(USER_UPDATE_TYPE).includes(val)) {
        throw Error("invalid update type");
      }
      return val;
    }),
  body("name")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("name_required")
    .trim()
    .escape(),
  body("branch")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("branch_required")
    .bail()
    .custom(async (id) => {
      const branch = await BranchModel.findOne({
        _id: mongoose.Types.ObjectId(id),
      });
      if (!branch) {
        return Promise.reject("branch_invalid");
      }
      return Promise.resolve();
    })
    .trim()
    .escape(),

  body("weeklyOf*")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("weekly_of_required")

    .trim()
    .escape(),
  body("role")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("role is required!")
    .bail()
    .custom((val) => {
      if (!Object.values(USER_ROLES).includes(parseInt(val))) {
        throw Error("bad_userrole_selcetion");
      }
      return val;
    })
    .trim()
    .escape(),
  body("department")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("department_required")
    .trim()
    .escape(),
  body("designation")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("designation_required")
    .trim()
    .escape(),
  body("phone")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("mobile number is required!")
    .isNumeric()
    .withMessage("Only integers are accepted!"),

  body("phone_emergency")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Emergency mobile number is required!")
    .isNumeric()
    .withMessage("Only integers are accepted for Emergency mobile number!"),

  body("address")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("address is required!")
    .trim()
    .escape(),

  body("profile_url")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("profile_url is required!")
    .trim()
    .escape(),
  body("blood_group").optional({ nullable: true }).trim(),
  body("dob")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("date of birth is required!")
    .trim()
    .escape(),

  body("parent_id")
    .optional({ nullable: true })
    .if(body("role").not().isIn([USER_ROLES.admin, USER_ROLES.hr]))
    .notEmpty({ ignore_whitespace: true })
    .withMessage("parent_id_required")
    .bail()
    .custom(async (val, { req }) => {
      if (val) {
        const user = await UserModel.findOne({
          _id: mongoose.Types.ObjectId(val),
          role: USER_ROLES.manager,
        });
        if (!user) {
          throw Error("user not valid");
        }
        req.parentUser = user;
      }
      return val;
    })
    .withMessage("invalid_parent_id")
    .trim(),

  body("bank_name")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Bank Name is requierd!"),
  body("account_no")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Account No is required!")
    .isNumeric()
    .withMessage("Only integers are accepted!"),
  body("ifsc_code")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("IFSC code is required!"),

  body("pan_no")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("PAN number is required!"),
  body("aadhar_no")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("AADHAR number is required!"),

  body("basic_salary")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Basic salary is required!")
    .isNumeric()
    .withMessage("Basic salary must be numeric"),
  body("house_rent_allowance")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("House Rent Allowance is required!")
    .isNumeric()
    .withMessage("House Rent Allowance must be numeric"),
  body("conveyence_allowance")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Conveyence Allowance is required!")
    .isNumeric()
    .withMessage("Conveyence Allowance must be numeric"),
  body("food_allowance")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Food Allowance is required!")
    .isNumeric()
    .withMessage("Food Allowance must be numeric"),

  body("other_allowance")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Other Allowance is required!")
    .isNumeric()
    .withMessage("Other Allowance must be numeric"),
  body("incencitive")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Incencitive is required!")
    .isNumeric()
    .withMessage("Incencitive must be numeric"),
  body("medical_allowance")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Medical Allowance is required!")
    .isNumeric()
    .withMessage("Medical Allowance must be numeric"),

  body("proffesional_tax")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Proffesional Tax is required!")
    .isNumeric()
    .withMessage("Proffesional Tax must be numeric"),

  body("pf_id")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Provident Fund is is required!")
    .trim()
    .escape(),
  body("uan_id")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("UAN id is is required!")
    .trim()
    .escape(),
  body("pf_percent")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Provident deduction amount is required!")
    .trim()
    .escape(),
  body("esic_id")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("esic id is required!")
    .isNumeric()
    .withMessage("esic must be numeric"),

  body("esic_percent")
    .optional({ nullable: true })
    .notEmpty({ ignore_whitespace: true })
    .withMessage("Esic deduction is required!")
    .isNumeric()
    .withMessage("Esic deduction must be numeric"),

  PayloadValidatorMiddleware,
  async (req, res, next) => {
    try {
      console.log(3);
      const { id, updateType, ...updates } = matchedData(req);
      const filter = { _id: mongoose.Types.ObjectId(req.requestedUser._id) };

      let updatableData = {};

      // if (updateType == 'parent_id') {
      // 	// adding current parent and his parent for herarchy
      // 	if (req.parentUser.parent_id)
      // 		updatableData['parent_id'] = [
      // 			req.parentUser._id,
      // 			...req.parentUser.parent_id
      // 		]
      // 	else
      // 		updatableData['parent_id'] = [
      // 			req.parentUser._id
      // 		]
      // }
      if (updateType == USER_UPDATE_TYPE.personalDetails) {
        updatableData = updates;
      } else if (updateType == USER_UPDATE_TYPE.companyDetails) {
        // const {
        // 	basicSalary,
        // 	houseRentAllowance,
        // 	conveyenceAllowance,
        // 	foodAllowance,
        // 	otherAllowance,
        // 	incencitive,
        // 	medicalAllowance
        // } = updates

        // updatableData = {
        // 	salary: {
        // 		basicSalary,
        // 		houseRentAllowance,
        // 		conveyenceAllowance,
        // 		foodAllowance,
        // 		otherAllowance,
        // 		incencitive,
        // 		medicalAllowance
        // 	}
        // }

        //To update parent of user
        if (req.requestedUser.perant_id[0] == parent_id) {
          updates.parent_id = req.requestedUser.parent_id;
        } else {
          if (req.parentUser.parent_id)
            updates.parent_id = [
              req.parentUser._id,
              ...req.parentUser.parent_id,
            ];
          else updates.parent_id = [req.parentUser._id];
        }

        // when updating role teamLead -> employee removing user from parent of employees
        if (req.requestedUser == USER_ROLES.tl && role == USER_ROLES.employee) {
          await UserModel.updateMany(
            { parent_id: req.requestedUser._id },
            { $pull: { parent_id: req.requestedUser._id } }
          );
        }

        updatableData = updates;
      } else if (updateType == USER_UPDATE_TYPE.bankDetails) {
        const { bank_name, account_no, ifsc_code } = updates;

        // updatableData = {
        //   bank_details: {
        //     bank_name,
        //     account_no,
        //     ifsc_code,
        //   },
        // };
        updatableData["bank_details"] = updates;
      } else if (updateType == USER_UPDATE_TYPE.salaryDetails) {
        // const { proffesional_tax } = updates;
        updatableData["salary"] = updates;
        // updatableData = {
        //   taxes: {
        //     proffesional_tax,
        //   },
        // };
      } else if ((updateType == USER_UPDATE_TYPE.taxesDetails)) {
        const {
          proffesional_tax,
          pf_id,
          uan_id,
          pf_percent,
          esic_id,
          esic_percent,
        } = updates;
        updatableData["taxes"] = proffesional_tax;
        updatableData["pf"] = {
          pf_id,
          uan_id,
          pf_percent,
        };
        updatableData["esic"] = {
          esic_id,
          esic_percent,
        };
      } else {
        updatableData = updates;
      }
      //   else if (updateType == "pf") {
      //     const { pf_id, uan_id, pf_percent } = updates;

      //     updatableData['pfDetails'] = {

      //         pf_id,
      //         uan_id,
      //         pf_percent,

      //     };
      //   } else if (updateType == "esic") {
      //     const { esic_id, esic_percent } = updates;

      //     updatableData = {
      //       taxes: {
      //         esic_id,
      //         esic_percent,
      //       },
      //     };
      //   } else {
      //     updatableData = updates;
      //   }
      console.log(updatableData);
      console.log(filter)

      const results = await UserModel.updateOne(filter, updatableData);
      console.log(results)
      return apiResponseHelper.successResponse(
        res,
        (msg = "User has been updated"),
        {}
      );
    } catch (error) {
      console.log(error.message);
      return apiResponseHelper.errorResponse(res, "server error");
    }
  },
];

module.exports = UpdateUserController;
