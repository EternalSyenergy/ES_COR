// controllers/camera.controller.js

const cameraService = require("../services/camera.service");

const getCameras = async (req, res) => {
    try {
        const cameras = cameraService.getCameras();

        res.status(200).json({
            success: true,
            data: cameras,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get cameras",
            error: error.message,
        });
    }
};

const getCamera = async (req, res) => {
    try {
        const { cameraId } = req.params;

        const camera =
            cameraService.getCameraById(cameraId);

        if (!camera) {
            return res.status(404).json({
                success: false,
                message: "Camera not found",
            });
        }

        res.status(200).json({
            success: true,
            data: camera,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get camera",
            error: error.message,
        });
    }
};

module.exports = {
    getCameras,
    getCamera,
};