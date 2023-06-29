const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
import embedMiddleware from '../middlewares/embed';
import React from "react";
import Argument from "../../src/components/Argument";
import { getArgument } from '../helpers/logoraRenderAPI';

/**
 * @openapi
 * /embed/argument:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Argument widget pre-rendering endpoint
 *     description: Get metadata about a argument and the HTML rendering of its widget
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: id
 *         description: 'Argument identifier'
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: HTML of the argument widget and metadata.
 *         examples:
 *           success: true
 *           resource:
 *             id: 1234
 *           html: '<div id="logoraRoot">...</div>'
 */
router.post('/', settingsMiddleware, embedMiddleware('argument_embed', getArgument, getArgumentComponent));

function getArgumentComponent(resource) {
    return (
        <Argument
            nestingLevel={0}
            positionIndex={0}
            debatePositions={resource.group.group_context.positions}
            debateIsActive={true}
            debateSlug={null}
            argument={resource}
            expandable={false}
            fixedContentHeight={true}
            disableLinks={true}
        />
    )
}

export default router;