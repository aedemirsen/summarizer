const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Summarizer API",
      version: "1.0.0",
      description: "API documentation for the Summarizer backend",
      contact: {
        name: "API Support"
      }
    },
    servers: [
      {
        url: "/",
        description: "Same-origin (recommended)"
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Admin token for protected endpoints (ADMIN_STATS_TOKEN)"
        }
      }
    }
  },
  apis: ["./api/**/*.js", "./swagger-docs.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
