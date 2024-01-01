const apiResponseHelper = require('../utils/apiResponse.helper.js')
const moduleAccessMiddleware = (allowedModules = []) => {
  return (req, res, next) => {
    if (!allowedModules.includes(req.user.role)) {
      return apiResponseHelper.forbiddenResponse(
        res,
        'You are not allowed to access this route',
      )
    }
    next()
  }
}
module.exports = moduleAccessMiddleware
