const otpGenerator = require("otp-generator");
const slugify = require("slugify");
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
module.exports = {
  handleOtpGenerate,
  generateSlug,
  remainingTimeFromCurrent,
};
