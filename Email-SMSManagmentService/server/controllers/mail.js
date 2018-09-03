import emailServer from '../../config/email';

function sendTokenEmail(call,callback){
  var mailOptions = {
    from: 'besparma@gmail.com',
    to: call.request.email,
    subject: 'ForgetPassword',
    text: `http://localhost:3000/api/users/api/customer/verify/` + call.request.token,
  };
  
  emailServer.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
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


export default {sendTokenEmail}