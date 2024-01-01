
const { default: mongoose } = require('mongoose');
const UserModel = require('../../model/User.model.js');
const TokenServices = require('../../services/Token.service.js');
const apiResponseHelper = require('../../utils/apiResponse.helper.js');
const _lang = require('../../utils/lang/index.js');


const ResetTokenController = async (req, res) =>
{
    try
    {

        const token = req.body.refresh_token;

        const verified = new TokenServices('refresh').verify(token);

        if (verified)
        {

            const user = new TokenServices('refresh').decode(token);

            if (user && user._id)
            {
                return await UserModel.findById(user._id).then(async (userResponse) =>
                {
                    if (userResponse && token === userResponse._doc.refresh_token)
                    {

                        const refresh_token = new TokenServices('refresh').generate({ _id: userResponse._doc._id })
                        const access_token = new TokenServices('access').generate({ _id: userResponse._doc._id })

                        await UserModel.updateOne({ _id: mongoose.Types.ObjectId(userResponse._id) }, { access_token, refresh_token })

                        return apiResponseHelper.successResponseWithData(res, _lang('token_refreshed', req.client_lang), {
                            refresh_token,
                            access_token
                        })
                    } else
                    {
                        return apiResponseHelper.unauthorizedResponse(res, _lang('token_not_valid', req.client_lang));
                    }
                }).catch((e) =>
                {

                    return apiResponseHelper.unauthorizedResponse(res, e.message);
                })
            } else
            {
                return apiResponseHelper.unauthorizedResponse(res, _lang('token_not_valid', req.client_lang));
            }
        } else
        {
            // Access Denied
            return apiResponseHelper.unauthorizedResponse(res, _lang('token_expired', req.client_lang));
        }
    } catch (error)
    {
        // Access Denied        
        return apiResponseHelper.unauthorizedResponse(res, error);
    }



}
module.exports = ResetTokenController
