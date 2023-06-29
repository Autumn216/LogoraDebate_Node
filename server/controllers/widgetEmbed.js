const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
import embedMiddleware from '../middlewares/embed';
import React from "react";
import { getSynthesisById } from '../helpers/logoraRenderAPI';
import { DebateEmbedOneLine } from '@logora/debate.debate.debate_embed_one_line';

/**
 * @openapi
 * /embed/widget:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Group widget pre-rendering endpoint
 *     description: Get metadata about a argument and the HTML rendering of its widget
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: id
 *         description: 'Group identifier'
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: HTML of the group widget and metadata.
 *         examples:
 *           success: true
 *           resource:
 *             id: 1234
 *           html: '<div id="logoraRoot">...</div>'
 */
router.post('/', settingsMiddleware, embedMiddleware('widget_embed', getSynthesisById, getWidgetComponent, true));

function getWidgetComponent(resource) {
    return (
        <DebateEmbedOneLine debate={resource} />
    )
}

export default router;
export { getWidgetComponent };