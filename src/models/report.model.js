const REPORT_DETECTION_TYPES = [
    "PPE",
    "PEST",
    "FIRE_SMOKE",
    "INTRUSION",
    "PERSON",
    "VEHICLE",
];

const REPORT_STATUS = [
    "OPEN",
    "ACKNOWLEDGED",
    "RESOLVED",
    "FALSE_POSITIVE",
];

const REPORT_FIELDS = {
    id: "id",
    reportId: "report_id",
    detectionType: "detection_type",
    cameraId: "camera_id",
    cameraName: "camera_name",
    location: "location",
    imageUrl: "image_url",
    confidence: "confidence",
    status: "status",
    metadata: "metadata",
    detectedAt: "detected_at",
    createdAt: "created_at",
    updatedAt: "updated_at",
};

module.exports = {
    REPORT_DETECTION_TYPES,
    REPORT_STATUS,
    REPORT_FIELDS,
};