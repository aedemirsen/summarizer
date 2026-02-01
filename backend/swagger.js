const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Summarizer API",
      version: "1.0.0",
      description: "API documentation for the AI Text Summarizer backend",
      contact: {
        name: "API Support"
      }
    },
    servers: [
      {
        url: "http://localhost:9090",
        description: "Local development server"
      },
      {
        url: "http://103.83.87.101:9090",
        description: "Production server"
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
