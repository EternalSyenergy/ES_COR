const nodemailer = require('nodemailer');

// 1. Create a transport based on environment variables
const getTransporter = () => {
  // If you decide to switch to Amazon SES later, 
  // you just change this configuration object.


if( process.env.NODE_ENV=="production"){


        return nodemailer.createTransport({
            host: process.env.AWS_SES_HOST,
            port: parseInt(process.env.AWS_SES_PORT || "587"),
            secure: false, // true for 465, false for 587
            auth: {
              user: process.env.AWS_SES_USER,
              pass: process.env.AWS_SES_PASS,
            },
          });

        }else{

          return nodemailer.createTransport({
            service: 'gmail', 
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS, // App Password
            },
          });


}


  

};

const sendOtpEmail = async (email, otp) => {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };



// FUTURE: Amazon SES Configuration
// const getTransporter = () => {
//   return nodemailer.createTransport({
//     host: "email-smtp.ap-south-1.amazonaws.com", // AWS SMTP endpoint
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.AWS_SES_USER,
//       pass: process.env.AWS_SES_PASS,
//     },
//   });
// };