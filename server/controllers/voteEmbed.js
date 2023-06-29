const settingsMiddleware = require('../middlewares/settings');
const { getPinnedGroup } = require("../helpers/logoraRenderAPI");
const { getHtml } = require("../middlewares/embed");
const { getGroupComponent } = require("./groupEmbed");

const express = require('express');
const router = express.Router();

/**
 * @openapi
 * /embed/group:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Last group widget pre-rendering endpoint
 *     description: Get metadata about a debate and the HTML rendering of its widget
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

function voteMiddleware(req, res, next) {
    const config = res.locals.config;
    if(!config || !config.api_key) return next();
    config.insertType = req.query.insertType ? req.query.insertType : "universalCode";
    try {
        getPinnedGroup(config.api_key).then(value => {
            if (value.data.data.length > 0) {
                const resourceType = "group"
                const resource = value.data.data[0];
                resource.resourceName = "vote_embed"
                const result = getHtml(config, resource, "vote_embed", getGroupComponent, req.query.device, true);
                const response = {
                    success: true,
                    debate: {
                        id: resource.id,
                        slug: resource.slug,
                        name: resource.name,
                        type: resourceType,
                    },
                    html: result
                };
                return res.status(200).json(response);
            } else {
                return res.status(500).json({ success: false, error: "No resource was retrieved." });
            }
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

router.post('/', settingsMiddleware, voteMiddleware);

export default router;