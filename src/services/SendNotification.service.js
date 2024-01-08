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
    // const user = await UserModel.findById(userId);
    // const registrationToken = userId.fcm_token;

    const message = {
      token:
        "flEpfsFiRhW4GSqm0eSV98:APA91bHfWoneE-nmAf-fKYwuyBSxBI3thGGG9SjF9J6XANQ2OO5hQzlznb_CgkPIAKtZ1z7a6OtGBe94ZmGx_sSysjRDHM3byPW_fM2BJfrzLt15G5pSXWfwTAUaUqdg6po8cYFc1so0",
      notification: {
        title: "Login Successful",
        body: "LFG",
      },
    };

    await admin.messaging().send(message);
  } catch (error) {
    return apiResponseHelper.errorResponse(res, "Server Error");
    // return apiResponseHelper.errorResponse(res, (msg = "request is not sent!"));
  }
};

module.exports = SendNotifcationService;
