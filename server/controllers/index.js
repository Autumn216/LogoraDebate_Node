const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../middlewares/cache.js');
import appRouter from '../controllers/app';
import synthesisRouter from '../controllers/synthesis';
import widgetRouter from '../controllers/widget';
import argumentEmbedRouter from '../controllers/argumentEmbed';
import proposalEmbedRouter from '../controllers/proposalEmbed';
import consultationEmbedRouter from '../controllers/consultationEmbed';
import groupEmbedRouter from '../controllers/groupEmbed';
import voteEmbedRouter from '../controllers/voteEmbed';
import widgetEmbedRouter from '../controllers/widgetEmbed';
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Logora Pre-render API",
        version: "0.9.0",
        description: "A pre-rendering API for Logora",
      },
    },
    apis: ['./server/**/*.js']
};
const specs = swaggerJsdoc(swaggerOptions);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
router.use('/app', cacheMiddleware(86400), appRouter);
router.use('/synthesis', cacheMiddleware(), synthesisRouter);
router.use('/widget', cacheMiddleware(), widgetRouter);
router.use('/embed/vote', cacheMiddleware(), voteEmbedRouter);
router.use('/embed/argument', cacheMiddleware(), argumentEmbedRouter);
router.use('/embed/proposal', cacheMiddleware(), proposalEmbedRouter);
router.use('/embed/consultation', cacheMiddleware(), consultationEmbedRouter);
router.use('/embed/group', cacheMiddleware(), groupEmbedRouter);
router.use('/embed/widget', cacheMiddleware(), widgetEmbedRouter);

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - status
 *     summary: Status endpoint
 *     description: Status endpoint
 *     responses:
 *       200:
 *         description: A success message.
 *         examples: 
 *           name: 'Logora Render'
 *           status: 'everything is alright'
 *           environment: 'production'
 *           image_version: 'aaaaaa'
 */
router.get('/', (req, res) => {
    return res.json({success: true, data: { name: "Logora Render API", status: "everything is alright", environment: process.env.TARGET_ENV, image_version: process.env.IMAGE_VERSION }});
});

export default router;