const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
import embedMiddleware from '../middlewares/embed';
import React from "react";
import GroupEmbed from "../../src/components/GroupEmbed";
import { CommentsEmbed } from '@logora/debate.comment.comments_embed';
import { getSynthesisById } from '../helpers/logoraRenderAPI';

/**
 * @openapi
 * /embed/group:
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
router.post('/', settingsMiddleware, embedMiddleware('group_embed', getSynthesisById, getGroupComponent, true));

function getGroupComponent(resource) {
    return (
        <GroupEmbed group={resource} />
    )
}

function getCommentsComponent(resource) {
    return (
       <CommentsEmbed source={resource} />
    )
}

export default router;
export { getGroupComponent, getCommentsComponent };