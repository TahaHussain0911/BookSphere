const multer = require("multer");
const path = require("path");
const { fileSize, allowedImageTypes } = require("../helper/constant");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName =
      file.originalname.split(extension)[0] + "-" + Date.now() + extension;
    cb(null, fileName);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: fileSize,
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname)?.slice(1); // to skip . on 0 index
    const allowedType = allowedImageTypes?.includes(extension);
    if (!allowedType) {
      return cb(new AppError("Invalid File Type!", StatusCodes.BAD_REQUEST));
    }
    cb(null, true);
  },
});
module.exports = upload;
