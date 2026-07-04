const pool = require('../config/db');
const bcrypt = require('bcrypt');
const userSchema = require('../models/user.model'); // Import your model

const createUser = async (email, password, role) => {
  const hash = await bcrypt.hash(password, 12); // Increased salt rounds for better security
  
  // Dynamically use tableName and fields from your model
  const query = `
    INSERT INTO ${userSchema.tableName} (email, password_hash, role) 
    VALUES ($1, $2, $3) 
    RETURNING id, email, role`;
    
  const result = await pool.query(query, [email, hash, role || 'user']);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  // Use model fields instead of hardcoded *
  const query = `SELECT ${userSchema.fields.join(', ')} FROM ${userSchema.tableName} WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const saveOtp = async (email, otp, expires) => {
  // Dynamically uses the table name from your schema
  const query = `
    UPDATE ${userSchema.tableName} 
    SET otp_code = $1, otp_expires = $2 
    WHERE email = $3
  `;
  await pool.query(query, [otp, expires, email]);
};

const verifyOtpAndReset = async (email, otp, newPasswordHash) => {
  // Using tableName from schema
  // Note: We use specific fields here for the SET clause
  const query = `
    UPDATE ${userSchema.tableName} 
    SET password_hash = $1, otp_code = NULL, otp_expires = NULL 
    WHERE email = $2 AND otp_code = $3 AND otp_expires > NOW()
    RETURNING id;
  `;
  const result = await pool.query(query, [newPasswordHash, email, otp]);
  return result.rowCount > 0;
};

const getAllUsers = async () => {
  // This automatically selects all fields defined in your schema
  const query = `SELECT ${userSchema.fields.join(', ')} FROM ${userSchema.tableName}`;
  const result = await pool.query(query);
  return result.rows;
};


const getUserById = async (id) => {
  const query = `SELECT id, email, role, created_at FROM ${userSchema.tableName} WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};


const updateRefreshToken = async (userId, refreshToken) => {
  const query = `
    UPDATE ${userSchema.tableName} 
    SET refresh_token = $1 
    WHERE id = $2
  `;
  await pool.query(query, [refreshToken, userId]);
};

module.exports = { updateRefreshToken, createUser, getUserByEmail , saveOtp, verifyOtpAndReset, getAllUsers, getUserById};