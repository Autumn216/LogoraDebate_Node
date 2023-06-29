// CREATE DEBATE MIDDLEWARE
const { createDebate, getDebateByName } = require("../helpers/logoraRenderAPI");

const createDebateMiddleware = function (req, res, next) {
    const config = res.locals.config;
    const source = req.body.source;
    const debate = req.body.debate;
    if(!config || !debate || !config.api_key) return res.status(404).json({ success: false });
    if(!shouldCreateDebate(debate, config)) return res.status(404).json({ success: false });
    if(!("title" in source)) return res.status(404).json({ success: false });
    let debateData = {};
    if("name" in debate) {
        debateData = debate;
    } else {
        if(("synthesis" in config) && (config.synthesis.autoCreateDebate === true)) {
            debateData = {
                name: source.title,
                identifier: debate.identifier,
                image_url: source.origin_image_url,
            }
        }
    }
    if (Object.keys(debateData).length !== 0) {
        getDebateByName(config.api_key, debateData.name).then(response => {
            if (response.data.success && response.data.data.length == 0) {
                createDebate(config.api_key, debateData).then(response => {
                    return res.status(404).json({ success: false });
                }).catch(error => {
                    return res.status(404).json({ success: false, error: "[CreateDebate] An error occurred while creating debate" });
                });
            } else {
                return res.status(404).json({ success: false, error: "[CreateDebate] Debate already exists" });
            }
        }).catch(error => {
            return res.status(404).json({ success: false, error: "[CreateDebate] An error occurred while retrieving debate" });
        });
    }
}

function shouldCreateDebate(debate, config) {
    if(debate && config) {
        if("name" in debate) {
            return true;
        } else {
            if(("synthesis" in config) && (config.synthesis.autoCreateDebate === true)) {
                return true;
            }
        }
    }
    return false;
}

module.exports = createDebateMiddleware;