/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /api/extension/summarize:
 *   post:
 *     summary: Summarize text using free mode
 *     tags: [Extension]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - installId
 *               - text
 *               - provider
 *               - model
 *             properties:
 *               installId:
 *                 type: string
 *                 description: Anonymous extension install ID
 *               extensionVersion:
 *                 type: string
 *                 description: Extension version
 *               text:
 *                 type: string
 *                 description: Text to summarize (max 5000 chars)
 *               provider:
 *                 type: string
 *                 enum: [groq, gemini]
 *                 description: LLM provider
 *               model:
 *                 type: string
 *                 description: Model name
 *               bulletSummary:
 *                 type: boolean
 *                 description: Use bullet points format
 *               outputLanguage:
 *                 type: string
 *                 description: Output language code (auto, en, tr, etc.)
 *     responses:
 *       200:
 *         description: Summary generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 summary:
 *                   type: string
 *                 usage:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     provider:
 *                       type: string
 *       429:
 *         description: Daily limit reached
 */

/**
 * @swagger
 * /api/extension/usage:
 *   post:
 *     summary: Get current usage for an install ID
 *     tags: [Extension]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - installId
 *             properties:
 *               installId:
 *                 type: string
 *               extensionVersion:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [groq, gemini]
 *     responses:
 *       200:
 *         description: Usage information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 usage:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     provider:
 *                       type: string
 */

/**
 * @swagger
 * /api/extension/telemetry:
 *   post:
 *     summary: Send telemetry event
 *     tags: [Extension]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - installId
 *               - eventType
 *             properties:
 *               installId:
 *                 type: string
 *               eventType:
 *                 type: string
 *               extensionVersion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event recorded
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get extension statistics
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to include in stats
 *     responses:
 *       200:
 *         description: Statistics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 windowDays:
 *                   type: integer
 *                 installs:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     active7d:
 *                       type: integer
 *                     active30d:
 *                       type: integer
 *                 events:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/total-queries:
 *   get:
 *     summary: Get total queries count (all users, all models, all modes)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total queries statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 totalQueries:
 *                   type: integer
 *                   description: Grand total of all queries
 *                 breakdown:
 *                   type: object
 *                   properties:
 *                     freeMode:
 *                       type: integer
 *                     ownApiKey:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/free-queries:
 *   get:
 *     summary: Get free mode queries breakdown by provider/model
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Free queries by provider
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 totalFreeQueries:
 *                   type: integer
 *                 byProvider:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                   example:
 *                     groq: 150
 *                     gemini: 80
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/own-key-queries:
 *   get:
 *     summary: Get own API key queries count
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Own-key queries statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 totalOwnKeyQueries:
 *                   type: integer
 *                 note:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/total-users:
 *   get:
 *     summary: Get total users (extension installs) count
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total users statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 totalUsers:
 *                   type: integer
 *                   description: Total number of extension installs
 *                 activeUsers:
 *                   type: object
 *                   properties:
 *                     last7Days:
 *                       type: integer
 *                     last30Days:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 */

module.exports = {};
