const admin = require("firebase-admin");
const UserModel = require("../model/User.model");
const apiResponseHelper = require("../utils/apiResponse.helper");
const dotenv = require("dotenv");
dotenv.config();

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_CREDENTIAL
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const SendNotifcationService = async (notification, userId) => {
  try {
    const users = await UserModel.find({ _id: { $in: userId } });

    users.forEach(async user => {
      const message = {
        token: user.fcm_token,
        notification,
      };
      
      await admin.messaging().send(message);
      // notification: {
      //   title: "Login Successful",
      //   body: "LFG",
      // },
    });
    
  } catch (error) {
    return apiResponseHelper.errorResponse(res, "Server Error");
    // return apiResponseHelper.errorResponse(res, (msg = "request is not sent!"));
  }
};

module.exports = SendNotifcationService;
