const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: '4ccd6eb61d93040757634dd0fbedd365-713d4f73-f0cbaae8',
    domain: 'sandbox14c5f0b2b91b4b2b8258fafba6b54d6f.mailgun.org',
  }
}

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail =  (email, subject, text, cb) => {
  const mailOption = {
    from: email,
    to: 'sabelojala5@gmail.com',
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOption, (err, data) => {
    if(err) {
     cb(err, null);
    } else {
      cb(null, data);
    }
  });
}

module.exports = sendMail;