const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");

const _lang = require("../../utils/lang");

const RegisterController = [
  async (req, res, next) => {
    try {
      //   const {
      //     name,
      //     email,
      //     password,
      //     employee_type,
      //     branch,
      //     department,
      //     designation,
      //     join_date,

      //     phone,
      //     phone_emergency,
      //     address,
      //     profile_url,
      //     blood_group,
      //     dob,
      //     weekly_of,

      //     bank_name,
      //     account_no,
      //     ifsc_code,

      //     pan_no,
      //     aadhar_no,

      //     basic_salary,
      //     house_rent_allowance,
      //     conveyence_allowance,
      //     food_allowance,
      //     other_allowance,
      //     incencitive,
      //     medical_allowance,

      //     proffesional_tax,

      //     pf_id,
      //     uan_id,
      //     pf_percent,
      //     esic_id,
      //     esic_percent,
      //     nda_url,
      //     aggreement_url,

      //     addhar_url,
      //     pan_url,
      //   } = req.body;

      //   let parentIdArr = null;

      //   if (req.parentUser) {
      //     if (req.parentUser.parent_id && Array.isArray(req.parentUser.parent_id))
      //       parentIdArr = [req.parentUser._id, ...req.parentUser.parent_id];
      //     else parentIdArr = [req.parentUser._id];
      //   }

      //   const employee_id = await CreateUniqueEmployeeIdService();

      //   const user = await UserModel.create({
      //     name,
      //     email,
      //     employee_id,
      //     password,
      //     role,
      //     employee_type,
      //     branch,
      //     department,
      //     designation,
      //     join_date: new Date(join_date).toISOString(),

      //     phone,
      //     phone_emergency,
      //     address,
      //     profile_url,
      //     blood_group,
      //     dob: new Date(dob),
      //     weekly_of,
      //     parent_id: parentIdArr,
      //     phone,

      //     bank_details: {
      //       bank_name,
      //       account_no,
      //       ifsc_code,
      //     },

      //     pan_no,
      //     aadhar_no,

      //     salary: {
      //       basic_salary,
      //       house_rent_allowance,
      //       conveyence_allowance,
      //       food_allowance,
      //       other_allowance,
      //       incencitive,
      //       medical_allowance,
      //     },
      //     taxes: {
      //       proffesional_tax,
      //     },
      //     pf: {
      //       pf_id,
      //       uan_id,
      //       pf_percent,
      //     },
      //     esic: {
      //       esic_id,
      //       esic_percent,
      //     },
      //     nda_url,
      //     aggreement_url,
      //     addhar_url,
      //     pan_url,
      //   });

      const user = await UserModel.create(req.body);

      return apiResponseHelper.successResponseWithData(
        res,
        "user created",
        user
      );
    } catch (e) {
      console.log(e);
      return apiResponseHelper.errorResponse(res, _lang("server_error"));
    }
  },
];

module.exports = RegisterController;
