const otpGenerator = require("otp-generator");
const handleOtpGenerate = () => {
  return otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
module.exports = {
  handleOtpGenerate,
};
