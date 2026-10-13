const bcrypt = require("bcrypt");
const pool = require("../config/db.js");

/**
 * Get all users.
 */
const getAllUsers = async () => {
    const { rows } = await pool.query(`
        SELECT id, name, department, status, "lastLogin", email,role
        FROM users
        ORDER BY id DESC
    `);

    return rows;
};

/**
 * Get one user by ID.
 */
const getUserById = async (id) => {
    const { rows } = await pool.query(
        `SELECT
            id,
            name,
            department,
            status,
            "lastLogin",
            email
         FROM users
         WHERE id = $1`,
        [id]
    );

    return rows[0] || null;
};

/**
 * Update user name and department.
 */
const updateUser = async (id, { name, department }) => {
    const { rows } = await pool.query(
        `UPDATE users
         SET name = COALESCE($1, name),
             department = COALESCE($2, department)
         WHERE id = $3
         RETURNING id, name, department, status, "lastLogin"`,
        [name ?? null, department ?? null, id]
    );

    return rows[0] || null;
};

/**
 * Activate or deactivate a user.
 */
const updateUserStatus = async (id, status) => {
    const { rows } = await pool.query(
        `UPDATE users
         SET status = $1
         WHERE id = $2
         RETURNING id, name, department, status, "lastLogin"`,
        [status, id]
    );

    return rows[0] || null;
};

/**
 * Delete a user.
 */
const deleteUser = async (id) => {
    const { rows } = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id`,
        [id]
    );

    return rows[0] || null;
};


const createUser = async (userData) => {
    const {
        name,
        email,
        phonenumber,
        department,
        role,
        password,
        status = "active",
    } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
        `INSERT INTO users (
            name,
            email,
            phonenumber,
            department,
            role,
            password_hash,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            name,
            email,
            phonenumber,
            department,
            role,
            status,
            "lastLogin"`,
        [
            name,
            email,
            phonenumber || null,
            department,
            role,
            hashedPassword,
            status,
        ]
    );

    return rows[0];
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser,
    createUser,
};
