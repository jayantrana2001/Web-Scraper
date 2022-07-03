const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    },
    tls: {
      rejectUnauthorized: false
  }
  });

var mailOptions = {
    from: process.env.USER,
    to: 'jayant.rana.751@gmail.com',
    subject: '',
    text:''
    };

    
function sendMail(subject,text,link,url) {
    mailOptions.subject = subject;
    mailOptions.html = "<a href="+url+link+ ">" + text + "</a>";
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendMail;