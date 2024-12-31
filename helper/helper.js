const otpGenerator = require("otp-generator");
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
module.exports = {
  handleOtpGenerate,
  remainingTimeFromCurrent,
};
