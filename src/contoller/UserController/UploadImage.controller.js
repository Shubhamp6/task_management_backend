const User = require("../../model/User.model");
const apiResponseHelper = require("../../utils/apiResponse.helper");
const { initializeApp } = require("firebase/app")
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage")
const multer = require('multer')
const { v4: uuidv4 } = require('uuid');
const config = require("../../config/firebase.config")


const giveCurrentDateTime = () =>
{
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + "-" + (today.getDay());
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    return dateTime;
}

const UserProfileController = [
    async (req, res) =>
    {
        try
        {
            initializeApp(config.firebaseConfig)
            const storage = getStorage();
            const dateTime = giveCurrentDateTime();
            const storageRef = ref(storage, `files/${req.file.originalname + " " + dateTime}`)



            const metadata = {
                contentType: req.file.mimetype,
            };
            console.log(req.file.buffer)
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata)

            const downloadURL = await getDownloadURL(snapshot.ref);
            const id = req.body.userid;
            console.log(id);
            const find_user = await User.updateOne({ _id: id }, { $set: { profile_url: downloadURL } });
            return apiResponseHelper.successResponseWithData(res, msg = "image uploaded", find_user)

        } catch (error)
        {

            return apiResponseHelper.unauthorizedResponse(
                res,
                (msg = "Request is not sent!")
            );
        }
    },
];

const sendImageURlController = [];

module.exports = UserProfileController;
