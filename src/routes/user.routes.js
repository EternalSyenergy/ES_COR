
const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUser,
    editUser,
    changeUserStatus,
    removeUser,
    createUser,
} = require("../controllers/user.controller.js");

/**
 * Get all users.
 * GET /api/users
 */
router.get("/", getUsers);

/**
 * Get one user.
 * GET /api/users/:id
 */
router.get("/:id", getUser);

/**
 * Update user details.
 * PATCH /api/users/:id
 */
router.patch("/:id", editUser);

/**
 * Change user status.
 * PATCH /api/users/:id/status
 */
router.patch("/:id/status", changeUserStatus);

/**
 * Delete user.
 * DELETE /api/users/:id
 */
router.delete("/:id", removeUser);

router.post("/",createUser);

module.exports = router;
