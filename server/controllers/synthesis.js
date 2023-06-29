const settingsMiddleware = require('../middlewares/settings');
const sourceMiddleware = require('../middlewares/source');
const sourceCacheMiddleware = require('../middlewares/sourceCache');
const createDebateMiddleware = require('../middlewares/createDebate');
const { getSynthesis } = require("../helpers/logoraRenderAPI");
const { getHtml } = require("../middlewares/embed");
const { getGroupComponent } = require("./groupEmbed");
const { getConsultationComponent } = require("./consultationEmbed");
const { getCommentsComponent } = require("./groupEmbed");

const express = require('express');
const router = express.Router();

function synthesisMiddleware(req, res, next) {
    const config = res.locals.config;
    if(!config || !config.api_key) return next();
    if(!req.query.uid) return res.status(404).json({success: false});
    config.insertType = req.query.insertType ? req.query.insertType : "universalCode";
    let renderHtml = req.query.noHtml ? false : true;
    let uid = req.query.uid;
    try {
        config.debate = {
            identifier: uid,
        };
        getSynthesis(config.api_key, uid).then(value => {
            const resourceType = value.data.data.resource_type;
            const resource = value.data.data.resource;
            const result = renderHtml && getHtml(config, resource, getResourceName(resourceType), getResourceComponent(resourceType), req.query.device, true);
            const resourceKey = (resourceType === "Comments") ? "source" : "debate";
            const response = {
                success: true,
                [resourceKey]: {
                    id: resource.id,
                    slug: resource.slug,
                    name: resource.name || resource.title,
                    type: resourceType,
                    direct_url: resource.direct_url,
                    created_at: resource.created_at,
                    image_url: resource.image_url,
                    contributions_count: resource.comments_count || null
                },
                content: (renderHtml && result) || null
            };
            return res.status(200).json(response);
        }).catch(error => {
            if (error.response && error.response.status === 404) {
                if(req.body.debate) {
                    return next();
                } else {
                    return res.status(error.response.status).json({ success: false });
                }
            } else {
                return res.status(500).json({ success: false });
            }
        });
    } catch (error) {
        return res.status(500).json({success: false, error: "Internal server error"});
    }
}

function getResourceName(resourceType) {
    if (resourceType == 'Group') { return "group_embed" }
    if (resourceType == 'Consultation') { return "consultation_embed" }
    if (resourceType == 'Comments') { return "comments_embed" }
}

function getResourceComponent(resourceType) {
    if (resourceType == 'Group') { return getGroupComponent }
    if (resourceType == 'Consultation') { return getConsultationComponent }
    if (resourceType == 'Comments') { return getCommentsComponent }
}

/**
 * @openapi
 * /synthesis:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Debate synthesis pre-rendering endpoint
 *     description: Get information about a debate and the HTML rendering of its synthesis
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: uid
 *         description: 'Page identifier to retrieve associated debate from'
 *         in: query
 *         type: string
 *         required: true
 *       - name: device
 *         description: 'User device type to get responsive code. Can be "mobile", "tablet", or "desktop"'
 *         in: query
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: HTML of the debate synthesis and information about the debate.
 *         examples: 
 *           success: true
 *           debate:
 *             id: 123
 *             slug: my-debate
 *             name: 'My debate ?'
 *             direct_url: https://example.com/debate/my-debate
 *             type: 'Group'
 *           content: '<div id="logoraRoot">...</div>'
 */
router.post('/', settingsMiddleware, sourceCacheMiddleware, sourceMiddleware, synthesisMiddleware, createDebateMiddleware);

export default router;