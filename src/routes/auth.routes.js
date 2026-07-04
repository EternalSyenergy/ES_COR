const express = require('express');
const router = express.Router();
const { register, login,getProfile,refresh,resetPasswordWithOtp,requestOtp} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const { sendResponse } = require('../utils/response.util'); // Import your new util

// Define the paths
router.post('/register', register);
router.post('/login', login);
router.post('/login', login);
router.post('/resetpassword', resetPasswordWithOtp);
router.post('/sendotp', requestOtp);
router.post('/refresh', refresh);


// This route is protected and only for superusers
router.get('/admin', protect, authorize('superuser'), (req, res) => {
    // res.json({ message: "Admin access granted" });
    sendResponse(res, 200, { message: "Admin access granted" }, 'Admin access successful');
});
router.get('/profile', protect, getProfile);
module.exports = router;