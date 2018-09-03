var nodemailer = require('nodemailer');
var  config = require('./env');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: config.emailAuth
});

export default transporter;