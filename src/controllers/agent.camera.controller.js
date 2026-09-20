const cameraService = require("../services/camera.service");


// ==========================================
// AUTHENTICATION
// ==========================================

function checkAgentAuth(req) {

    const authorization =
        req.headers.authorization;

    const expected =
        `Bearer ${process.env.AGENT_API_KEY}`;

    return authorization === expected;
}


// ==========================================
// GET CAMERAS FOR PYTHON
// ==========================================

const getAgentCameras = async (req, res) => {

    try {

        if (!checkAgentAuth(req)) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"
            });
        }


        const cameras =
            cameraService.getCameras();


        res.status(200).json({

            success: true,

            cameras
        });


    } catch (error) {

        console.error(
            "Agent camera error:",
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


// ==========================================
// UPDATE STATUS
// ==========================================

const updateCameraStatus = async (
    req,
    res
) => {

    try {

        if (!checkAgentAuth(req)) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"
            });
        }


        const {
            cameraId
        } = req.params;


        const {
            status,
            message
        } = req.body;


        const camera =
            cameraService.updateCameraStatus(
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


        res.json({

            success: true,

            data: camera
        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to update camera status"
        });
    }
};


// ==========================================
// UPDATE STREAM URL
// ==========================================

const updateCameraStream = async (
    req,
    res
) => {

    try {

        if (!checkAgentAuth(req)) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"
            });
        }


        const {
            cameraId
        } = req.params;


        const {
            streamUrl
        } = req.body;


        const camera =
            cameraService.updateCameraStream(
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


        res.json({

            success: true,

            data: camera
        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message:
                "Failed to update stream URL"
        });
    }
};


module.exports = {

    getAgentCameras,

    updateCameraStatus,

    updateCameraStream
};