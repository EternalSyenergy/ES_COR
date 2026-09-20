// const cameras = [
//     {
//         cameraId: "CAM-001",
//         name: "Production Camera 01",
//         location: "Production Area A",
//         status: "Online",
//         streamUrl: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
//     },

//     {
//         cameraId: "CAM-002",
//         name: "Warehouse Camera 01",
//         location: "Warehouse",
//         status: "Online",
//         streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
//     },
//     {
//         cameraId: "CAM-003",
//         name: "Assembly Camera 01",
//         location: "Assembly Area",
//         status: "Online",
//         streamUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
//     },
//     {
//         cameraId: "CAM-004",
//         name: "Main Entrance Camera",
//         location: "Main Entrance",
//         status: "Online",
//         streamUrl: "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8",
//     },
//     {
//         cameraId: "CAM-005",
//         name: "Loading Bay Camera",
//         location: "Loading Bay",
//         status: "Online",
//         streamUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
//     },
//     {
//         cameraId: "CAM-006",
//         name: "Parking Lot Camera",
//         location: "Parking Lot",
//         status: "Online",
//         streamUrl: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
//     },
//     {
//         cameraId: "CAM-007",
//         name: "Rooftop Camera 01",
//         location: "Rooftop",
//         status: "Online",
//         streamUrl: "https://playertest.longtailvideo.com/adaptive/wowzaid3/playlist.m3u8",
//     },
//     {
//         cameraId: "CAM-008",
//         name: "Corridor Camera 01",
//         location: "Corridor A",
//         status: "Online",
//         streamUrl: "https://content.jwplatform.com/manifests/vM7nH0Kl.m3u8",
//     },
//     {
//         cameraId: "CAM-009",
//         name: "Loading Dock Camera",
//         location: "Loading Dock",
//         status: "Online",
//         streamUrl: "https://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8",
//     },
//     {
//         cameraId: "CAM-010",
//         name: "Office Wing Camera",
//         location: "Office Wing",
//         status: "Online",
//         streamUrl: "https://res.cloudinary.com/dannykeane/video/upload/sp_full_hd/q_80:qmax_90,ac_none/v1/dk-memoji-dark.m3u8",
//     },
//     {
//         cameraId: "CAM-011",
//         name: "Storage Room Camera",
//         location: "Storage Room",
//         status: "Online",
//         streamUrl: "https://diceyk6a7voy4.cloudfront.net/e78752a1-2e83-43fa-85ae-3d508be29366/hls/fitfest-sample-1_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_6.0Mbps_qvbr.m3u8",
//     },
//     {
//         cameraId: "CAM-012",
//         name: "Break Room Camera",
//         location: "Break Room",
//         status: "Online",
//         streamUrl: "https://assets.afcdn.com/video49/20210722/v_645516.m3u8",
//     },
//     {
//         cameraId: "CAM-013",
//         name: "Server Room Camera",
//         location: "Server Room",
//         status: "Online",
//         streamUrl: "https://content.jwplatform.com/manifests/yp34SRmf.m3u8",
//     },
//     {
//         cameraId: "CAM-014",
//         name: "Perimeter Camera 01",
//         location: "North Perimeter",
//         status: "Online",
//         streamUrl: "https://moctobpltc-i.akamaihd.net/hls/live/571329/eight/playlist.m3u8",
//     },
//     {
//         cameraId: "CAM-015",
//         name: "Perimeter Camera 02",
//         location: "South Perimeter",
//         status: "Online",
//         streamUrl: "https://d3rlna7iyyu8wu.cloudfront.net/skip_armstrong/skip_armstrong_stereo_subs.m3u8",
//     },
// ];
// const getCameras = () => {
//     return cameras;
// };

// const getCameraById = (cameraId) => {
//     return cameras.find(
//         (camera) => camera.cameraId === cameraId
//     );
// };

// module.exports = {
//     getCameras,
//     getCameraById,
// };

const cameras = [
  {
    cameraId: "CAM-001",
    name: "Production Camera 01",
    location: "Production Area A",
    status: "Online",
    streamUrl: "http://192.168.0.103:3002/hls/camera01/index.m3u8",
  },

  {
    cameraId: "CAM-001",
    name: "Production Camera 01",
    location: "Production Area A",
    status: "Online",
    streamUrl: "http://192.168.0.103:3002/hls/camera01/index.m3u8",
  },

  {
    cameraId: "CAM-002",
    name: "Production Camera 01",
    location: "Production Area A",
    status: "Online",
    streamUrl: "http://192.168.0.103:3002/hls/camera01/index.m3u8",
  },
];

/**
 * React dashboard
 *
 * Does NOT expose RTSP credentials.
 */
const getCameras = () => {
  return cameras.map((camera) => ({
    cameraId: camera.cameraId,
    name: camera.name,
    location: camera.location,
    status: camera.status,
    statusMessage: camera.statusMessage,
    enabled: camera.enabled,
    streamUrl: camera.streamUrl,
  }));
};

/**
 * React dashboard - single camera.
 */
const getCameraById = (cameraId) => {
  const camera = cameras.find((camera) => camera.cameraId === cameraId);

  if (!camera) {
    return null;
  }

  return {
    cameraId: camera.cameraId,
    name: camera.name,
    location: camera.location,
    status: camera.status,
    statusMessage: camera.statusMessage,
    enabled: camera.enabled,
    streamUrl: camera.streamUrl,
  };
};

/**
 * Python Agent
 *
 * This returns the RTSP configuration.
 */
const getAgentCameras = () => {
  return cameras.filter((camera) => camera.enabled === true);
};

/**
 * Python Agent updates camera status.
 */
const updateCameraStatus = (cameraId, status, message = "") => {
  const camera = cameras.find((camera) => camera.cameraId === cameraId);

  if (!camera) {
    return null;
  }

  camera.status = status;
  camera.statusMessage = message;

  return {
    cameraId: camera.cameraId,
    status: camera.status,
    statusMessage: camera.statusMessage,
  };
};

/**
 * Python Agent updates HLS URL.
 */
const updateCameraStream = (cameraId, streamUrl) => {
  const camera = cameras.find((camera) => camera.cameraId === cameraId);

  if (!camera) {
    return null;
  }

  camera.streamUrl = streamUrl;

  return {
    cameraId: camera.cameraId,
    streamUrl: camera.streamUrl,
  };
};

module.exports = {
  getCameras,
  getCameraById,
  getAgentCameras,
  updateCameraStatus,
  updateCameraStream,
};
