// API Configuration
// Change this URL based on your environment (local development, staging, production)
const API_CONFIG = {
  // For local development
  baseUrl: "http://localhost:9090"
};

// Expose for Chrome extension service worker (importScripts)
if (typeof self !== "undefined") {
  self.API_CONFIG = API_CONFIG;
}

// Export for Node.js tooling
if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG;
}
