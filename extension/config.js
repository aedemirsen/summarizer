// API Configuration
// Change this URL based on your environment (local development, staging, production)
const API_CONFIG = {
  // For local development
  // baseUrl: "http://localhost:9090",
  
  // For production
  baseUrl: "http://103.83.87.101:9090"
};

// Export for use in background.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
