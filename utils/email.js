const htmlToText = require("html-to-text");
const transport = require("nodemailer");
const pug = require("pug");
class Email {
  constructor(user, url) {
    console.log(user,'user');
    
    this.to = user.email;
    this.name = user.name;
    this.from = `Book Sphere <${process.env.MAIL_EMAIL}>`;
  }
  createTransport() {
    return transport.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  async sendMailTemplate({ template, subject, payload }) {
    const html = pug.renderFile(
      `${__dirname}/../views/pug/${template || "userMessage"}.pug`,
      {
        subject,
        payload,
      }
    );
    // for those who donot support html convert it to plain text
    // so it is readable
    const text = htmlToText.convert(html);
    const mail = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text,
    };
    await this.createTransport().sendMail(mail);
  }
  async sendOtpCode(params) {
    await this.sendMailTemplate({
      template: "userMessage",
      subject: "OTP Verification",
      payload: params,
    });
  }
}
module.exports = Email;
