const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendResponse } = require('../utils/response.util'); // Import your new util
const { parseExpiry } = require('../utils/utils');
const { sendOtpEmail } = require('../utils/mailer');
const register = async (req, res) => {
  try {
    const user = await authService.createUser(req.body.email, req.body.password, req.body.role);
    // Consistent response
    sendResponse(res, 201, { id: user.id, email: user.email }, 'User registered successfully');
  } catch (err) { 
    sendResponse(res, 400, null, 'Registration failed'); 
  }
};

const login = async (req, res) => {
  try {
    const user = await authService.getUserByEmail(req.body.email);
    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      return sendResponse(res, 401, null, 'Invalid credentials');
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY});
   
    await authService.updateRefreshToken(user.id, refreshToken);
    const maxAge = parseExpiry(process.env.REFRESH_TOKEN_EXPIRY);
        // Send refresh token as a secure cookie
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: false, // true if using HTTPS
            sameSite: 'Strict',
            // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            maxAge: maxAge // Use the parsed expiry time
          });


    sendResponse(res, 200, { token }, 'Login successful');
  } catch (err) {
    sendResponse(res, 500, null, 'Internal server error');
    // sendResponse(res, 500, { error: err.message }, 'Internal server error');
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return sendResponse(res, 401, null, 'No refresh token');

  const refreshToken = cookies.jwt;
  const user = await authService.getUserByRefreshToken(refreshToken);
  
  if (!user) return sendResponse(res, 403, null, 'Invalid refresh token');

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) return sendResponse(res, 403, null, 'Forbidden');
    
    // Generate new Access Token
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    sendResponse(res, 200, { accessToken }, 'Token refreshed');
  });
};


const requestOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

  await authService.saveOtp(email, otp, expiry);

  await sendOtpEmail(email, otp);
  sendResponse(res, 200, null, 'OTP sent to your email');
};

const resetPasswordWithOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const success = await authService.verifyOtpAndReset(email, otp, hashedPassword);
  
  if (!success) {
    return sendResponse(res, 400, null, 'Invalid or expired OTP');
  }
  
  sendResponse(res, 200, null, 'Password reset successful');
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.id);
    
    if (!user) {
      return sendResponse(res, 404, null, 'User not found');
    }

    sendResponse(res, 200, user, 'Profile retrieved successfully');
  } catch (err) {
    sendResponse(res, 500, null, 'Internal server error');
  }
};


module.exports = { register, login, refresh, requestOtp, resetPasswordWithOtp, getProfile };