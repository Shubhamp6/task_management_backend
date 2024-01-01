
const { default: mongoose } = require("mongoose");
const { body } = require("express-validator");
const PayloadValidatorMiddleware = require("../../middleware/PayloadValidator.middleware");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const UserModel = require("../../model/User.model");
const BranchModel = require("../../model/Branch.model");
const DepartmentModel = require("../../model/Department.model");
const EmployeeTypeModel = require("../../model/EmployeeType.model");

const _lang = require("../../utils/lang");
const { USER_ROLES } = require("../../utils/constants/common.constants");
const CreateUniqueEmployeeIdService = require("../../services/CreateUniqueEmployeeId.service");


const RegisterController = [
	body("name")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("email_required")
		.trim().escape(),
	body("email")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("email_required")
		.bail()
		.isEmail()
		.withMessage("email_invalid!")
		.custom(async (email) => {
			const user = await UserModel.findOne({ email })
			if (user) {
				return Promise.reject('email_exist')
			}
			return Promise.resolve()
		})
		.trim()
		.escape(),


	


	body("password")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("password_required!")
		.trim()
		.escape(),
	body("role")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("role is required!")
		.bail()
		.custom((val) => {
			if (!Object.values(USER_ROLES).includes(parseInt(val))) {
				throw Error("bad_userrole_selcetion")
			}
			return true
		}).trim().escape()
	,
	body("branch")		
		.notEmpty({ ignore_whitespace: true })
		.withMessage("branch_required")
		.bail()
		.custom(async (id) => {
			const branch = await BranchModel.findOne({ _id: mongoose.Types.ObjectId(id) })
			if (!branch) {
				return Promise.reject('branch_invalid')
			}
			return Promise.resolve()
		})
		.trim()
		.escape(),
	body("employee_type")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("employee_type_required")
		.bail()
		.custom(async (id) => {
			const employee_type = await EmployeeTypeModel.findById(id)
			if (!employee_type) {
				return Promise.reject('employee_type_invalid')
			}
			return Promise.resolve()
		})
		.trim()
		.escape(),

	body("department")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("department_required")
		.bail()
		.custom(async (id) => {
			const department = await DepartmentModel.findById(id)
			if (!department) {
				return Promise.reject('department_invalid')
			}
			return Promise.resolve()
		})
		.trim()
		.escape(),
	body("designation")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("designation_required").trim().escape(),
	body("weekly_of.*")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("weekly_of_required")
		.trim()
		.escape(),
	body("join_date")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Joining date is required!").trim().escape(),
	body("phone")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("mobile number is required!")
		.isNumeric()
		.withMessage("Only integers are accepted!"),

	body("phone_emergency")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Emergency mobile number is required!")
		.isNumeric()
		.withMessage("Only integers are accepted for Emergency mobile number!"),
	body("address")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("address is required!").trim().escape(),

	body("profile_url")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("profile_url is required!").trim().escape(),
	body("blood_group")
		.optional({ nullable: true })
		.trim(),
	body("dob")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("date of birth is required!").trim().escape(),
	body("parent_id")
		.if(body('role').not().isIn([USER_ROLES.admin, USER_ROLES.hr]))
		.notEmpty({ ignore_whitespace: true })
		.withMessage("parent_id_required")
		.bail()
		.custom(async (val, { req }) => {
			if (val) {
				const user = await UserModel.findOne({ _id: mongoose.Types.ObjectId(val) })
				if (!user) {
					throw Error('user not valid')
				}
				req.parentUser = user
			}
			return val

		}).withMessage('invalid_parent_id')
		.trim(),

	body("bank_name")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Bank Name is requierd!"),
	body("account_no")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Account No is required!")
		.isNumeric()
		.withMessage("Only integers are accepted!"),
	body("ifsc_code")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("IFSC code is required!"),
	body("pan_no")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("PAN number is required!"),
	body("aadhar_no")
		.notEmpty({ ignore_whitespace: true })
		.withMessage("AADHAR number is required!"),


	body("basic_salary")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Basic salary is required!")
		.isNumeric()
		.withMessage("Basic salary must be numeric")
	,
	body("house_rent_allowance")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("House Rent Allowance is required!")
		.isNumeric()
		.withMessage("House Rent Allowance must be numeric")
	,
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
		.escape()
	,
	body("pf_percent")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("Provident deduction amount is required!")
		.trim()
		.escape()
	,

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

	body("nda_url")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("nda is required!").trim().escape(),
	body("aggreement_url")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("aggreement is required!").trim().escape(),
	body("addhar_url")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("addhar is required!").trim().escape(),
	body("pan_url")
		.optional({ nullable: true })
		.notEmpty({ ignore_whitespace: true })
		.withMessage("pan is required!").trim().escape(),

	PayloadValidatorMiddleware,

	async (req, res, next) => {
		try {


			const {
				name,
				email,
				password,
				role,
				employee_type,
				branch,
				department,
				designation,
				join_date,

				phone,
				phone_emergency,
				address,
				profile_url,
				blood_group,
				dob,
				weekly_of,

				bank_name,
				account_no,
				ifsc_code,

				pan_no,
				aadhar_no,

				basic_salary,
				house_rent_allowance,
				conveyence_allowance,
				food_allowance,
				other_allowance,
				incencitive,
				medical_allowance,

				proffesional_tax,

				pf_id,
				uan_id,
				pf_percent,
				esic_id,
				esic_percent,
				nda_url,
				aggreement_url,

				addhar_url,
				pan_url,
			} = req.body;

			let parentIdArr = null


			if (req.parentUser) {
				if (req.parentUser.parent_id && Array.isArray(req.parentUser.parent_id))
					parentIdArr = [
						req.parentUser._id
						,
						...req.parentUser.parent_id
					]
				else
					parentIdArr = [
						req.parentUser._id
					]
			}

			const employee_id = await CreateUniqueEmployeeIdService()
			
			const user = await UserModel.create({
				name,
				email,
				employee_id,
				password,
				role,
				employee_type,
				branch,
				department,
				designation,
				join_date: new Date(join_date).toISOString(),

				phone,
				phone_emergency,
				address,
				profile_url,
				blood_group,
				dob: new Date(dob),
				weekly_of,
				parent_id: parentIdArr,
				phone,

				bank_details: {
					bank_name,
					account_no,
					ifsc_code
				},



				pan_no,
				aadhar_no,


				salary: {
					basic_salary,
					house_rent_allowance,
					conveyence_allowance,
					food_allowance,
					other_allowance,
					incencitive,
					medical_allowance,


				},
				taxes: {

					proffesional_tax,

				},
				pf: {
					pf_id,
					uan_id,
					pf_percent
				},
				esic: {
					esic_id,
					esic_percent
				},
				nda_url,
				aggreement_url,
				addhar_url,
				pan_url
			});

			return apiResponseHelper.successResponseWithData(res, 'user created', user)
		} catch (e) {
			console.log(e)
			return apiResponseHelper.errorResponse(res, _lang('server_error'))
		}

	}
];

module.exports = RegisterController;