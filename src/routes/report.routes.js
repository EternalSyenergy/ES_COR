const express = require("express");

const router = express.Router();

const reportController =
    require("../controllers/report.controller");


// ======================================================
// CREATE
// ======================================================

router.post(
    "/",
    reportController.createReport
);


// ======================================================
// SUMMARY
// ======================================================

router.get(
    "/summary",
    reportController.getSummary
);


// ======================================================
// DETECTION COUNTS
// ======================================================

router.get(
    "/detection-counts",
    reportController.getDetectionCounts
);


// ======================================================
// STATUS COUNTS
// ======================================================

router.get(
    "/status-counts",
    reportController.getStatusCounts
);


// ======================================================
// LATEST
// ======================================================

router.get(
    "/latest",
    reportController.getLatestReports
);


// ======================================================
// OPEN
// ======================================================

router.get(
    "/open",
    reportController.getOpenReports
);


// ======================================================
// EXPORT
// ======================================================

router.get(
    "/export",
    reportController.getReportsForExport
);


// ======================================================
// BY REPORT UUID
// ======================================================

router.get(
    "/report-id/:reportId",
    reportController.getReportByReportId
);


// ======================================================
// BY DETECTION TYPE
// ======================================================

router.get(
    "/type/:type",
    reportController.getReportsByType
);


// ======================================================
// BY CAMERA
// ======================================================

router.get(
    "/camera/:cameraId",
    reportController.getReportsByCamera
);


// ======================================================
// GET ALL
// ======================================================

router.get(
    "/",
    reportController.getReports
);


// ======================================================
// UPDATE STATUS
// ======================================================

router.patch(
    "/:id/status",
    reportController.updateReportStatus
);


// ======================================================
// UPDATE
// ======================================================

router.put(
    "/:id",
    reportController.updateReport
);


// ======================================================
// DELETE MULTIPLE
// ======================================================

router.delete(
    "/",
    reportController.deleteMultipleReports
);


// ======================================================
// GET SINGLE
// ======================================================

router.get(
    "/:id",
    reportController.getReport
);


// ======================================================
// DELETE SINGLE
// ======================================================

router.delete(
    "/:id",
    reportController.deleteReport
);


module.exports = router;