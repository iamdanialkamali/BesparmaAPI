var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  
  auth: {
    user: 'daniel.kamali.dk@gmail.com',
    pass: 'Halamadrid'
  }
});


function sendTokenMail(mail,token){
  var mailOptions = {
    from: 'besparma@gmail.com',
    to: mail,
    subject: 'ForgetPassword',
    text: token
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}