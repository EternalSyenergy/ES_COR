const activeStreams = new Map();

/**
 * Start/register a camera stream.
 *
 * Node.js manages the stream information.
 * MediaMTX handles RTSP -> WebRTC conversion.
 */
const startStream = (camera) => {
    if (!camera || !camera.cameraId || !camera.streamUrl) {
        throw new Error("Invalid camera information");
    }

    const { cameraId, streamUrl } = camera;

    // Already active
    if (activeStreams.has(cameraId)) {
        return activeStreams.get(cameraId);
    }

    const stream = {
        cameraId,
        rtspUrl: streamUrl,
        streamPath: cameraId,
        status: "starting",
        startedAt: new Date(),
    };

    activeStreams.set(cameraId, stream);

    console.log(
        `[STREAM] Started: ${cameraId}`
    );

    console.log(
        `[STREAM] RTSP: ${streamUrl.replace(
            /\/\/([^:]+):([^@]+)@/,
            "//$1:****@"
        )}`
    );

    console.log(
        `[STREAM] MediaMTX path: ${cameraId}`
    );

    return stream;
};


/**
 * Get one active stream.
 */
const getStream = (cameraId) => {
    return activeStreams.get(cameraId) || null;
};


/**
 * Get all active streams.
 */
const getActiveStreams = () => {
    return Array.from(activeStreams.values());
};


/**
 * Check whether a stream is active.
 */
const isStreamActive = (cameraId) => {
    return activeStreams.has(cameraId);
};


/**
 * Stop one stream.
 */
const stopStream = (cameraId) => {
    const stream = activeStreams.get(cameraId);

    if (!stream) {
        return false;
    }

    activeStreams.delete(cameraId);

    console.log(
        `[STREAM] Stopped: ${cameraId}`
    );

    return true;
};


/**
 * Stop all streams.
 */
const stopAllStreams = () => {
    activeStreams.clear();

    console.log("[STREAM] All streams stopped");
};


module.exports = {
    startStream,
    getStream,
    getActiveStreams,
    isStreamActive,
    stopStream,
    stopAllStreams,
};