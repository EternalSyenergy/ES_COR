
const userService = require("../services/user.service.js");

/**
 * Validate user ID.
 */
const parseId = (value) => {
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

/**
 * GET /api/users
 * Get all users.
 */
const getUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

/**
 * GET /api/users/:id
 * Get one user.
 */
const getUser = async (req, res) => {
    try {
        const id = parseId(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",
            });
        }

        const user = await userService.getUserById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
};

/**
 * PATCH /api/users/:id
 * Update user details.
 */
const editUser = async (req, res) => {
    try {
        const id = parseId(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",
            });
        }

        const { name, department } = req.body ?? {};

        if (name === undefined && department === undefined) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        if (
            name !== undefined &&
            (typeof name !== "string" || !name.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid name",
            });
        }

        if (
            department !== undefined &&
            department !== null &&
            typeof department !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid department",
            });
        }

        const user = await userService.updateUser(id, {
            name: name === undefined ? undefined : name.trim(),
            department:
                department === undefined || department === null
                    ? department
                    : department.trim(),
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Update user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user",
        });
    }
};

/**
 * PATCH /api/users/:id/status
 * Change user status.
 */
const changeUserStatus = async (req, res) => {
    try {
        const id = parseId(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",
            });
        }

        const { status } = req.body ?? {};

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive",
            });
        }

        const user = await userService.updateUserStatus(id, status);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Update user status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user status",
        });
    }
};

/**
 * DELETE /api/users/:id
 * Delete user.
 */
const removeUser = async (req, res) => {
    try {
        const id = parseId(req.params.id);

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID",
            });
        }

        const user = await userService.deleteUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};


const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phonenumber,
            department,
            role,
            password,
            status = "active",
        } = req.body;

        if (!name || !email || !department || !role || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, department, role, and password are required",
            });
        }

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive",
            });
        }

        const user = await userService.createUser({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phonenumber,
            department,
            role,
            password,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        console.error("Create user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create user",
        });
    }
};


module.exports = {
    getUsers,
    getUser,
    editUser,
    changeUserStatus,
    removeUser,
    createUser,
};
