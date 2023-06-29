// SOURCE FETCHING MIDDLEWARE
const cacheClient = require("../helpers/cacheClient");
const { getSource, updateSource, createSource } = require("../helpers/logoraRenderAPI");

const sourceMiddleware = function (req, res, next) {
    const SOURCE_CACHE_TTL = 604800;
    const config = res.locals.config;
    if(!config || !config.api_key) return next();
    if(req.query.insertType == "amp") return next();
    if(req.query.id) return next(); // SKIP IF SOURCE FROM CACHE OR GETTING ID
    const sourceUid = req.query.uid;
    if(!sourceUid) return res.status(400).json({success: false, error: "Missing page identifier."});
    const sourceCacheKey = sourceUid + "-" + config.id;
    if(sourceNeedsGet(req.body.source, config.excluded_tags, config.synthesis && config.synthesis.pageExpirationDate)) {
        if(res.locals.source) {
            config.source = res.locals.source;
            if(sourceNeedsUpdate(req.body.source, res.locals.source)) {
                // Update source
                updateSource(config.api_key, sourceUid, updateData(req.body.source, res.locals.source)).then((value) => {
                    cacheClient.del(sourceCacheKey, function(error) {});
                    config.source = req.body.source;
                    return next();
                }).catch(error => {
                    return next();
                });
            } else {
                return next();
            }
        } else {
            getSource(config.api_key, sourceUid).then((value) => {
                const source = value.data.data.resource;
                if(sourceNeedsUpdate(req.body.source, source)) {
                    // Update source
                    updateSource(config.api_key, sourceUid, updateData(req.body.source, source)).then((value) => {
                        cacheClient.del(sourceCacheKey, function(error) {});
                        config.source = req.body.source;
                        return next();
                    }).catch(error => {
                        return next();
                    });
                } else {
                    config.source = source;
                    cacheClient.set(sourceCacheKey, JSON.stringify(source), { ttl: SOURCE_CACHE_TTL }, function(error) {});
                    return next();
                }
            }).catch(error => {
                if (!error.response || !error.response.data) return res.status(500).json({success: false});
                if (error.response.status === 404) {
                    if(!req.body.source) return next();
                    let sourceData = req.body.source;
                    sourceData['uid'] = req.query.uid;
                    createSource(config.api_key, sourceData).then((value) => {
                        const response = value.data;
                        if(response.success) {
                            res.locals.source = response.data;
                            config.source = response.data;
                        }
                        return next();
                    }).catch(createError => {
                        return res.status(422).json({success: false, error: "Error when creating source."});
                    });
                } else {
                    return next();
                }
            });
        }
    } else {
        return res.status(200).json({success: false, error: "Source excluded because of published date or tags."});
    }
}

function sourceNeedsUpdate(newSource, oldSource) {
    if(!newSource || !oldSource) {
        return false;
    }
    if("tag_objects" in newSource && "tags" in oldSource) {
        if(!arraysEqual(newSource.tag_objects.map(t => t.uid || t.name).map(v => v.toLowerCase()), oldSource.tags.map(t => t.name).map(v => v.toLowerCase()))) {
            return true;
        }
    }
    if(newSource.title != oldSource.title) {
        return true;
    }
    return false;
}

function updateData(newSource, oldSource) {
    let data = {};
    if(!newSource || !oldSource) {
        return {};
    }
    if(newSource.title != oldSource.title) {
        data["title"] = newSource.title;
    }
    if("tag_objects" in newSource && "tags" in oldSource) {
        if(!arraysEqual(newSource.tag_objects.map(t => t.uid || t.name).map(v => v.toLowerCase()), oldSource.tags.map(t => t.name).map(v => v.toLowerCase()))) {
            data["tag_objects"] = newSource.tag_objects;
        }
    }
    return data;
}

function isExpired(published_date, pageExpirationDate) {
    let expirationDate = new Date(new Date().setMonth(new Date().getMonth() - 18));
    if (pageExpirationDate) { expirationDate = new Date(pageExpirationDate); }
    if(published_date) {
        const date = new Date(published_date);
        return date < expirationDate;
    } else {
        return true;
    }
}

function sourceNeedsGet(source, excludedTags, pageExpirationDate) {
    if(source && !source.published_date) {
        return false;
    }
    if(!source || !source.published_date) {
        return true;
    }
    if(source.published_date && isExpired(source.published_date, pageExpirationDate)) {
        return false;
    }
    if(!excludedTags || !("list" in excludedTags) || !("tag_objects" in source)) {
        return true;
    }
    if(excludedTags.list.length === 0 || source.tag_objects.length === 0) {
        return true;
    }
    var formatted_tags = source.tag_objects.map(t => t.uid || t.name).map(t => t.toLowerCase());
    for(var i = 0; i < formatted_tags.length; i++) {
        if(excludedTags.list.includes(formatted_tags[i])) {
            return false;
        }
    }
    return true;
}

function arraysEqual(a1, a2) {
    if(a1.length !== a2.length) {
        return false;
    } else {
        return JSON.stringify([...a1].sort()) == JSON.stringify([...a2].sort());
    }
}

module.exports = sourceMiddleware;