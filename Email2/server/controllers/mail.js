import emailServer from '../../config/mail'

function sendTokenEmail(call,callback){
  var mailOptions = {
    from: 'besparma@gmail.com',
    to: call.request.mail,
    subject: 'ForgetPassword',
    text: call.request.token
  };
  
  emailServer.sendMail(mailOptions, function(error, info){
    if (error) {
      callback(error.message,{
        code:500,
        message: 'Email Sending Fail'
      });
    } else {callback(null,{
      code: 200 ,
      message: info.response
    });
      }
  });

}
export default sendTokenEmail