const otpGenerator = require("otp-generator");
const slugify = require("slugify");
const ObjectId = require("mongodb");

const handleOtpGenerate = () => {
  return otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
const remainingTimeFromCurrent = (timeInMilli) => {
  const remainingTimeInSeconds = Math.ceil((timeInMilli - Date.now()) / 1000);
  const seconds = remainingTimeInSeconds % 60;
  const minutes = Math.floor(remainingTimeInSeconds / 60);
  return {
    seconds,
    minutes,
  };
};
const generateSlug = (name) => {
  return slugify(name, {
    replacement: "-",
    lower: true,
    strict: true,
  });
};
const transformObjectId = (id) => {
  const object_id = new ObjectId(id);
  return object_id;
};

module.exports = {
  handleOtpGenerate,
  generateSlug,
  remainingTimeFromCurrent,
  transformObjectId,
};
