// routes/camera.routes.js

const express = require("express");

const router = express.Router();

const cameraController = require("../controllers/camera.controller");

// GET /api/cameras
router.get(
    "/",
    cameraController.getCameras
);

// GET /api/cameras/CAM-001
router.get(
    "/:cameraId",
    cameraController.getCamera
);

module.exports = router;