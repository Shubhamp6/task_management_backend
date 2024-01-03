const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Attachments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + req.user._id + path.extname(file.originalname));
  },
});

const UploadFileService = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
});

module.exports = UploadFileService;
