const Users = require('../../model/User.model')
const { body } = require('express-validator')
const PayloadValidatorMiddleware = require('../../middleware/PayloadValidator.middleware')
const apiResponseHelper = require('../../utils/apiResponse.helper')
const _lang = require('../../utils/lang')
const TokenServices = require('../../services/Token.service')
const UserModel = require('../../model/User.model')
const { default: mongoose } = require('mongoose')
const { generateValidationError } = require('../../utils/common.helper')
const { comparePass } = require('../../utils/passEncDec.helper')

const GetPeopleUnderMe = [
  async (req, res, next) => {
    try {
      console.log('inside ')
      console.log(req.user._id)
      const UserUnderMe = await Users.find({
        parent_id: {
          $in: [mongoose.Types.ObjectId(req.user._id)],
        },
      })
      console.log(UserUnderMe)
      return apiResponseHelper.successResponseWithData(
        res,
        _lang('User Found'),
        UserUnderMe,
      )
    } catch (e) {
      return apiResponseHelper.errorResponse(res, e.message)
    }
  },
]

module.exports = GetPeopleUnderMe
