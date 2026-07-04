// utils/time.util.js
const parseExpiry = (expiryString) => {
  // Simple logic to handle 'd' (days)
  if (expiryString.endsWith('d')) {
    const days = parseInt(expiryString);
    return days * 24 * 60 * 60 * 1000;
  }
  // You can add 'h' (hours) or 'm' (minutes) here
  return 3600000; // Default to 1 hour
};

module.exports = { parseExpiry };