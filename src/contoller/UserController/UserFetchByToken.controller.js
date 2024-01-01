const User = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const _lang = require("../../utils/lang");

const UserFetchByTokenController = [
	async (req, res) => {
		try {
			const userData = { ...req.user }
			delete userData['password']
			delete userData['access_token']
			delete userData['refresh_token']
			if (userData.parent_id && Array.isArray(userData.parent_id) && userData.parent_id[0]) {
				const requestedParent = await User.findById(userData.parent_id[0])
				userData['parent_id'] = [{
					_id: requestedParent._id,
					name: requestedParent.name
				}]
			}
			return apiResponseHelper.successResponseWithData(res, 'user info fetched', userData)
		
		} catch (e) {
			return apiResponseHelper.errorResponse(res, _lang('server_error'))
		}

	}
		
];

module.exports = UserFetchByTokenController;
