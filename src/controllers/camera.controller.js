// // // controllers/camera.controller.js

// const cameraService = require("../services/camera.service");
// const getCameras = async (req, res) => {
//     try {
//         const cameras = cameraService.getCameras();

//         res.status(200).json({
//             success: true,
//             data: cameras,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to get cameras",
//             error: error.message,
//         });
//     }
// };

// const getCamera = async (req, res) => {
//     try {
//         const { cameraId } = req.params;

//         const camera =
//             cameraService.getCameraById(cameraId);

//         if (!camera) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Camera not found",
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: camera,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to get camera",
//             error: error.message,
//         });
//     }
// };

// module.exports = {
//     getCameras,
//     getCamera,
// };





const cameraService = require("../services/camera.service");


// =====================================================
// GET ALL CAMERAS
// =====================================================

const getCameras = async (req, res) => {

    try {

        const cameras =
            await cameraService.getCameras();

        res.status(200).json({

            success: true,

            data: cameras

        });

    } catch (error) {

        console.error(
            "Get cameras error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to get cameras",

            error:
                error.message
        });
    }
};


// =====================================================
// GET SINGLE CAMERA
// =====================================================

const getCamera = async (req, res) => {

    try {

        const {
            cameraId
        } = req.params;


        const camera =
            await cameraService.getCameraById(
                cameraId
            );


        if (!camera) {

            return res.status(404).json({

                success: false,

                message:
                    "Camera not found"
            });
        }


        res.status(200).json({

            success: true,

            data: camera

        });

    } catch (error) {

        console.error(
            "Get camera error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to get camera",

            error:
                error.message
        });
    }
};


// =====================================================
// UPDATE STATUS
// =====================================================

const updateCameraStatus = async (
    req,
    res
) => {

    try {

        const {
            cameraId
        } = req.params;


        const {
            status,
            message = ""
        } = req.body;


        const camera =
            await cameraService.updateCameraStatus(
                cameraId,
                status,
                message
            );


        if (!camera) {

            return res.status(404).json({

                success: false,

                message:
                    "Camera not found"
            });
        }


        res.status(200).json({

            success: true,

            data: camera

        });

    } catch (error) {

        console.error(
            "Update status error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update status",

            error:
                error.message
        });
    }
};


// =====================================================
// UPDATE HLS URL
// =====================================================

const updateCameraStream = async (
    req,
    res
) => {

    try {

        const {
            cameraId
        } = req.params;


        const {
            streamUrl
        } = req.body;


        const camera =
            await cameraService.updateCameraStream(
                cameraId,
                streamUrl
            );


        if (!camera) {

            return res.status(404).json({

                success: false,

                message:
                    "Camera not found"
            });
        }


        res.status(200).json({

            success: true,

            data: camera

        });

    } catch (error) {

        console.error(
            "Update stream error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to update stream",

            error:
                error.message
        });
    }
};


module.exports = {

    getCameras,

    getCamera,

    updateCameraStatus,

    updateCameraStream
};




