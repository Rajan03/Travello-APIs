const nodemailer = require('nodemailer');

const sendMail = (options) => {
  // Creating transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    // Activate less secure option in gmail account
    auth: {
      user: process.env.EMAIL_USRNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // email options

  // sending email
};
