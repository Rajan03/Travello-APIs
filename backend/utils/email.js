const nodemailer = require('nodemailer');

exports.sendMail = async (options) => {
  // Creating transporter
  // Activate less secure option in gmail account
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_POST,
    auth: {
      user: process.env.EMAIL_USRNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // email options
  const mailOpts = {
    from: 'Rajan Verma <rv@dev.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // sending email
  const sentMessage = await transporter.sendMail(mailOpts);
  console.log(sentMessage);
};
