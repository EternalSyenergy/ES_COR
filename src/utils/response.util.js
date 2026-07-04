// A helper to ensure your API always returns the same format
const sendResponse = (res, statusCode, data, message = 'Success') => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data
    });
};

module.exports = { sendResponse };