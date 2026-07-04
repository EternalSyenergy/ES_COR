// This file acts as your "source of truth" for user data structure
const userSchema = {
    tableName: 'users',
  fields: [
        'id', 
        'email', 
        'password_hash', 
        'role', 
        'created_at', 
        'otp_code',     // Added
        'otp_expires' ,  // Added,
        'refresh_token' // Added
    ]
};

module.exports = userSchema;