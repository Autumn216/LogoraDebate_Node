const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
import embedMiddleware from '../middlewares/embed';
import React from "react";
import Proposal from "../../src/components/Proposal";
import { getProposal } from '../helpers/logoraRenderAPI';

/**
 * @openapi
 * /embed/proposal:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Proposal widget pre-rendering endpoint
 *     description: Get metadata about a proposal and the HTML rendering of its widget
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: id
 *         description: 'Proposal identifier'
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: HTML of the proposal widget and metadata about the proposal.
 *         examples:
 *           success: true
 *           resource:
 *             id: 1234
 *           html: '<div id="logoraRoot">...</div>'
 */
router.post('/', settingsMiddleware, embedMiddleware('proposal_embed', getProposal, getEmbedComponent));

function getEmbedComponent(resource) {
    return (
        <Proposal
            proposal={resource}
            disableLinks={true}
            fixedContentHeight={true}
        />
    )
}

export default router;