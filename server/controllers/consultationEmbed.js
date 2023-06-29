const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
import embedMiddleware from '../middlewares/embed';
import React from "react";
import { ConsultationEmbed } from "@logora/debate.consultation.consultation_embed";
import { getConsultationSynthesis } from '../helpers/logoraRenderAPI';

/**
 * @openapi
 * /embed/consultation:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Consultation widget pre-rendering endpoint
 *     description: Get metadata about a consultation and the HTML rendering of its widget
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: id
 *         description: 'Consultation slug'
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: HTML of the consultation widget and metadata.
 *         examples:
 *           success: true
 *           resource:
 *             id: presidentielle
 *           html: '<div id="logoraRoot">...</div>'
 */
router.post('/', settingsMiddleware, embedMiddleware('consultation_embed', getConsultationSynthesis, getConsultationComponent));

function getConsultationComponent(resource) {
    return (
       <ConsultationEmbed 
            consultation={resource}
       />
    )
}

export default router;
export { getConsultationComponent };