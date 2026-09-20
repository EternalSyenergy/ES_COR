const reportService = require("../services/report.service");


// ======================================================
// CREATE
// ======================================================

const createReport = async (req, res) => {
    try {
        const report =
            await reportService.createReport(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: report,
        });
    } catch (error) {
        console.error(
            "Create report error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// GET ALL
// ======================================================

const getReports = async (req, res) => {
    try {
        const result =
            await reportService.getAllReports(
                req.query
            );

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error(
            "Get reports error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// GET BY ID
// ======================================================

const getReport = async (req, res) => {
    try {
        const report =
            await reportService.getReportById(
                req.params.id
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// GET BY REPORT UUID
// ======================================================

const getReportByReportId = async (
    req,
    res
) => {
    try {
        const report =
            await reportService.getReportByReportId(
                req.params.reportId
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// GET BY TYPE
// ======================================================

const getReportsByType = async (
    req,
    res
) => {
    try {
        const reports =
            await reportService.getReportsByType(
                req.params.type
            );

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// GET BY CAMERA
// ======================================================

const getReportsByCamera = async (
    req,
    res
) => {
    try {
        const reports =
            await reportService.getReportsByCamera(
                req.params.cameraId
            );

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// UPDATE
// ======================================================

const updateReport = async (req, res) => {
    try {
        const report =
            await reportService.updateReport(
                req.params.id,
                req.body
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report updated successfully",
            data: report,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// UPDATE STATUS
// ======================================================

const updateReportStatus = async (
    req,
    res
) => {
    try {
        const {
            status,
        } = req.body;

        const report =
            await reportService.updateReportStatus(
                req.params.id,
                status
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report status updated successfully",
            data: report,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// DELETE
// ======================================================

const deleteReport = async (req, res) => {
    try {
        const report =
            await reportService.deleteReport(
                req.params.id
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// DELETE MULTIPLE
// ======================================================

const deleteMultipleReports = async (
    req,
    res
) => {
    try {
        const {
            ids,
        } = req.body;

        const reports =
            await reportService.deleteMultipleReports(
                ids
            );

        res.status(200).json({
            success: true,
            message: "Reports deleted successfully",
            data: reports,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// SUMMARY
// ======================================================

const getSummary = async (req, res) => {
    try {
        const summary =
            await reportService.getSummary();

        res.status(200).json({
            success: true,
            data: summary,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// DETECTION COUNTS
// ======================================================

const getDetectionCounts = async (
    req,
    res
) => {
    try {
        const data =
            await reportService.getDetectionCounts();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// STATUS COUNTS
// ======================================================

const getStatusCounts = async (
    req,
    res
) => {
    try {
        const data =
            await reportService.getStatusCounts();

        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// LATEST
// ======================================================

const getLatestReports = async (
    req,
    res
) => {
    try {
        const limit =
            req.query.limit || 10;

        const reports =
            await reportService.getLatestReports(
                limit
            );

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// OPEN
// ======================================================

const getOpenReports = async (
    req,
    res
) => {
    try {
        const reports =
            await reportService.getOpenReports();

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ======================================================
// EXPORT
// ======================================================

const getReportsForExport = async (
    req,
    res
) => {
    try {
        const reports =
            await reportService.getReportsForExport(
                req.query
            );

        res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


module.exports = {
    createReport,
    getReports,
    getReport,
    getReportByReportId,
    getReportsByType,
    getReportsByCamera,
    updateReport,
    updateReportStatus,
    deleteReport,
    deleteMultipleReports,
    getSummary,
    getDetectionCounts,
    getStatusCounts,
    getLatestReports,
    getOpenReports,
    getReportsForExport,
};