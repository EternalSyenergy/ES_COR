const pool = require("../config/db");
const { randomUUID } = require("crypto");

const {
    REPORT_DETECTION_TYPES,
    REPORT_STATUS,
} = require("../models/report.model");


// ======================================================
// CREATE REPORT
// ======================================================

const createReport = async (data) => {
    const {
        detectionType,
        cameraId,
        cameraName,
        location,

        // Existing image URL support
        imageUrl,

        // New database image support
        imageData,
        imageMimeType,

        confidence,
        status = "OPEN",
        metadata = {},
        detectedAt,
    } = data;

    if (!detectionType) {
        throw new Error("detectionType is required");
    }

    if (!REPORT_DETECTION_TYPES.includes(detectionType)) {
        throw new Error(
            `Invalid detectionType. Allowed values: ${REPORT_DETECTION_TYPES.join(", ")}`
        );
    }

    if (!cameraId) {
        throw new Error("cameraId is required");
    }

    if (!REPORT_STATUS.includes(status)) {
        throw new Error(
            `Invalid status. Allowed values: ${REPORT_STATUS.join(", ")}`
        );
    }

    const reportId = randomUUID();

    const query = `
        INSERT INTO reports (
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_data,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12
        )
        RETURNING
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,
            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint;
    `;

    const values = [
        reportId,
        detectionType,
        cameraId,
        cameraName || null,
        location || null,
        imageUrl || null,

        // PostgreSQL BYTEA
        imageData || null,

        imageMimeType || null,

        confidence ?? null,
        status,
        metadata,
        detectedAt || new Date(),
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ======================================================
// GET ALL REPORTS
// ======================================================

const getAllReports = async (filters = {}) => {
    const {
        detectionType,
        cameraId,
        status,
        startDate,
        endDate,
        search,
        page = 1,
        limit = 20,
        sortBy = "detected_at",
        sortOrder = "DESC",
    } = filters;

    const conditions = [];
    const values = [];

    let parameterIndex = 1;

    if (detectionType) {
        conditions.push(
            `detection_type = $${parameterIndex}`
        );

        values.push(detectionType);
        parameterIndex++;
    }

    if (cameraId) {
        conditions.push(
            `camera_id = $${parameterIndex}`
        );

        values.push(cameraId);
        parameterIndex++;
    }

    if (status) {
        conditions.push(
            `status = $${parameterIndex}`
        );

        values.push(status);
        parameterIndex++;
    }

    if (startDate) {
        conditions.push(
            `detected_at >= $${parameterIndex}`
        );

        values.push(startDate);
        parameterIndex++;
    }

    if (endDate) {
        conditions.push(
            `detected_at <= $${parameterIndex}`
        );

        values.push(endDate);
        parameterIndex++;
    }

    if (search) {
        conditions.push(`
            (
                camera_name ILIKE $${parameterIndex}
                OR location ILIKE $${parameterIndex}
                OR detection_type ILIKE $${parameterIndex}
                OR camera_id ILIKE $${parameterIndex}
            )
        `);

        values.push(`%${search}%`);
        parameterIndex++;
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const allowedSortColumns = [
        "id",
        "detected_at",
        "created_at",
        "updated_at",
        "confidence",
        "camera_name",
        "detection_type",
        "status",
    ];

    const safeSortBy = allowedSortColumns.includes(sortBy)
        ? sortBy
        : "detected_at";

    const safeSortOrder =
        String(sortOrder).toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

    const pageNumber = Math.max(
        Number(page) || 1,
        1
    );

    const limitNumber = Math.min(
        Math.max(Number(limit) || 20, 1),
        100
    );

    const offset =
        (pageNumber - 1) * limitNumber;

    const countQuery = `
        SELECT COUNT(*)::INTEGER AS total
        FROM reports
        ${whereClause};
    `;

    /*
     * IMPORTANT:
     *
     * Do NOT SELECT image_data here.
     *
     * The actual image remains inside PostgreSQL,
     * but the dashboard only receives an image endpoint.
     *
     * This keeps the API response small.
     */
    const dataQuery = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports

        ${whereClause}

        ORDER BY ${safeSortBy} ${safeSortOrder}

        LIMIT $${parameterIndex}
        OFFSET $${parameterIndex + 1};
    `;

    const countValues = [...values];

    const dataValues = [
        ...values,
        limitNumber,
        offset,
    ];

    const [countResult, dataResult] =
        await Promise.all([
            pool.query(
                countQuery,
                countValues
            ),

            pool.query(
                dataQuery,
                dataValues
            ),
        ]);

    const total =
        countResult.rows[0].total;

    return {
        reports: dataResult.rows,

        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(
                total / limitNumber
            ),
        },
    };
};


// ======================================================
// GET REPORT IMAGE
// ======================================================

// const getReportImage = async (reportId) => {
//     const query = `
//         SELECT
//             image_data,
//             image_mime_type
//         FROM reports
//         WHERE report_id = $1
//         LIMIT 1;
//     `;

//     const result = await pool.query(
//         query,
//         [reportId]
//     );

//     if (result.rows.length === 0) {
//         return null;
//     }

//     const report = result.rows[0];

//     if (!report.image_data) {
//         return null;
//     }

//     return {
//         imageData: report.image_data,
//         mimeType: report.image_mime_type || "image/jpeg",
//     };
// };




const getReportImage = async (req, res) => {
    try {
        const { reportId } = req.params;

        const result =
            await reportService.getReportImage(reportId);

        if (!result) {
            return res.status(404).json({
                message: "Report image not found",
            });
        }

        res.setHeader(
            "Content-Type",
            result.mimeType
        );

        res.setHeader(
            "Cache-Control",
            "public, max-age=3600"
        );

        return res.send(result.imageData);

    } catch (error) {
        console.error(
            "Get report image error:",
            error
        );

        return res.status(500).json({
            message: "Failed to load report image",
        });
    }
};



// ======================================================
// GET REPORT BY ID
// ======================================================

const getReportById = async (id) => {
    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports
        WHERE id = $1;
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] || null;
};


// ======================================================
// GET REPORT BY REPORT ID
// ======================================================

const getReportByReportId = async (reportId) => {
    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports
        WHERE report_id = $1;
    `;

    const result = await pool.query(
        query,
        [reportId]
    );

    return result.rows[0] || null;
};


// ======================================================
// GET REPORTS BY TYPE
// ======================================================

const getReportsByType = async (type) => {
    if (!REPORT_DETECTION_TYPES.includes(type)) {
        throw new Error("Invalid detection type");
    }

    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports
        WHERE detection_type = $1
        ORDER BY detected_at DESC;
    `;

    const result = await pool.query(
        query,
        [type]
    );

    return result.rows;
};


// ======================================================
// GET REPORTS BY CAMERA
// ======================================================

const getReportsByCamera = async (cameraId) => {
    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports
        WHERE camera_id = $1
        ORDER BY detected_at DESC;
    `;

    const result = await pool.query(
        query,
        [cameraId]
    );

    return result.rows;
};


// ======================================================
// UPDATE REPORT
// ======================================================

const updateReport = async (id, data) => {
    const fields = [];
    const values = [];

    let parameterIndex = 1;

    const allowedFields = [
        "detection_type",
        "camera_id",
        "camera_name",
        "location",
        "image_url",
        "image_data",
        "image_mime_type",
        "confidence",
        "status",
        "metadata",
        "detected_at",
    ];

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            fields.push(
                `${field} = $${parameterIndex}`
            );

            values.push(data[field]);
            parameterIndex++;
        }
    }

    if (fields.length === 0) {
        return getReportById(id);
    }

    fields.push(
        "updated_at = NOW()"
    );

    values.push(id);

    const query = `
        UPDATE reports
        SET ${fields.join(", ")}
        WHERE id = $${parameterIndex}
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        values
    );

    return result.rows[0] || null;
};


// ======================================================
// UPDATE STATUS
// ======================================================

const updateReportStatus = async (
    id,
    status
) => {
    if (!REPORT_STATUS.includes(status)) {
        throw new Error(
            `Invalid status. Allowed values: ${REPORT_STATUS.join(", ")}`
        );
    }

    const query = `
        UPDATE reports
        SET
            status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [status, id]
    );

    return result.rows[0] || null;
};


// ======================================================
// DELETE REPORT
// ======================================================

const deleteReport = async (id) => {
    const query = `
        DELETE FROM reports
        WHERE id = $1
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [id]
    );

    return result.rows[0] || null;
};


// ======================================================
// DELETE MULTIPLE REPORTS
// ======================================================

const deleteMultipleReports = async (ids) => {
    if (
        !Array.isArray(ids) ||
        ids.length === 0
    ) {
        throw new Error(
            "ids must be a non-empty array"
        );
    }

    const query = `
        DELETE FROM reports
        WHERE id = ANY($1::BIGINT[])
        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [ids]
    );

    return result.rows;
};


// ======================================================
// SUMMARY
// ======================================================

const getSummary = async () => {
    const query = `
        SELECT

            COUNT(*)::INTEGER AS total,

            COUNT(*) FILTER (
                WHERE status = 'OPEN'
            )::INTEGER AS open,

            COUNT(*) FILTER (
                WHERE status = 'ACKNOWLEDGED'
            )::INTEGER AS acknowledged,

            COUNT(*) FILTER (
                WHERE status = 'RESOLVED'
            )::INTEGER AS resolved,

            COUNT(*) FILTER (
                WHERE status = 'FALSE_POSITIVE'
            )::INTEGER AS false_positive

        FROM reports;
    `;

    const result = await pool.query(query);

    return result.rows[0];
};


// ======================================================
// DETECTION COUNTS
// ======================================================

const getDetectionCounts = async () => {
    const query = `
        SELECT
            detection_type,
            COUNT(*)::INTEGER AS count
        FROM reports
        GROUP BY detection_type
        ORDER BY count DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ======================================================
// STATUS COUNTS
// ======================================================

const getStatusCounts = async () => {
    const query = `
        SELECT
            status,
            COUNT(*)::INTEGER AS count
        FROM reports
        GROUP BY status
        ORDER BY count DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ======================================================
// LATEST REPORTS
// ======================================================

const getLatestReports = async (
    limit = 10
) => {
    const safeLimit = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports

        ORDER BY detected_at DESC

        LIMIT $1;
    `;

    const result = await pool.query(
        query,
        [safeLimit]
    );

    return result.rows;
};


// ======================================================
// OPEN REPORTS
// ======================================================

const getOpenReports = async () => {
    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports

        WHERE status = 'OPEN'

        ORDER BY detected_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};


// ======================================================
// EXPORT REPORTS
// ======================================================

const getReportsForExport = async (
    filters = {}
) => {
    const {
        detectionType,
        cameraId,
        status,
        startDate,
        endDate,
    } = filters;

    const conditions = [];
    const values = [];

    let parameterIndex = 1;

    if (detectionType) {
        conditions.push(
            `detection_type = $${parameterIndex}`
        );

        values.push(detectionType);
        parameterIndex++;
    }

    if (cameraId) {
        conditions.push(
            `camera_id = $${parameterIndex}`
        );

        values.push(cameraId);
        parameterIndex++;
    }

    if (status) {
        conditions.push(
            `status = $${parameterIndex}`
        );

        values.push(status);
        parameterIndex++;
    }

    if (startDate) {
        conditions.push(
            `detected_at >= $${parameterIndex}`
        );

        values.push(startDate);
        parameterIndex++;
    }

    if (endDate) {
        conditions.push(
            `detected_at <= $${parameterIndex}`
        );

        values.push(endDate);
        parameterIndex++;
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const query = `
        SELECT
            id,
            report_id,
            detection_type,
            camera_id,
            camera_name,
            location,
            image_url,
            image_mime_type,
            confidence,
            status,
            metadata,
            detected_at,
            created_at,
            updated_at,

            CASE
                WHEN image_data IS NOT NULL
                THEN '/api/reports/' || report_id || '/image'
                ELSE NULL
            END AS image_endpoint

        FROM reports

        ${whereClause}

        ORDER BY detected_at DESC;
    `;

    const result = await pool.query(
        query,
        values
    );

    return result.rows;
};




module.exports = {
    createReport,

    getAllReports,

    getReportImage,

    getReportById,

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