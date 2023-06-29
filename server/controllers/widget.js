const express = require('express');
const router = express.Router();
const settingsMiddleware = require('../middlewares/settings');
const sourceMiddleware = require('../middlewares/source');
const sourceCacheMiddleware = require('../middlewares/sourceCache');
const createDebateMiddleware = require('../middlewares/createDebate');
const { getSynthesis } = require("../helpers/logoraRenderAPI");
const { getHtml } = require("../middlewares/embed");
const { getWidgetComponent } =  require("./widgetEmbed");

function widgetMiddleware(req, res, next) {
    const config = res.locals.config;
    if(!config || !config.api_key) return next();
    if(!req.query.uid) return res.status(404).json({success: false});
    config.insertType = req.query.insertType ? req.query.insertType : "universalCode";
    let uid = req.query.uid;
    try {
        config.debate = {
            identifier: uid,
        };
        getSynthesis(config.api_key, uid).then((value) => {
            const resourceType = value.data.data.resource_type;
            const resource = value.data.data.resource;
            const result = getHtml(config, resource, "widget_embed", getWidgetComponent, req.query.device, true);
            const response = {
                success: true,
                debate: {
                    id: resource.id,
                    slug: resource.slug,
                    name: resource.name || resource.title,
                    type: resourceType,
                    direct_url: resource.direct_url
                },
                content: result
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
                return res.status(500).json({success: false});
            }
        });
    } catch (error) {
        return res.status(500).json({success: false, error: "Internal server error"});
    }
}

/**
 * @openapi
 * /widget:
 *   post:
 *     tags:
 *       - pre-rendering
 *     summary: Debate widget pre-rendering endpoint
 *     description: Get information about a debate and the HTML rendering of its widget
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
 *         required: false
 *       - name: id
 *         description: 'Debate identifier (use if uid is not provided)'
 *         in: query
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: HTML of the debate widget and information about the debate.
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
router.post('/', settingsMiddleware, sourceCacheMiddleware, sourceMiddleware, widgetMiddleware, createDebateMiddleware);

export default router;