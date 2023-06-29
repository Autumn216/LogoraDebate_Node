// SOURCE CACHE MIDDLEWARE
const cacheClient = require("../helpers/cacheClient");

const sourceCacheMiddleware = function (req, res, next) {
    if (req.query.cache === 'false') return next();
    const config = res.locals.config;
    if(!config || !config.id) return next();
    const sourceUid = req.query.uid;
    if(!sourceUid) return next();
    const sourceCacheKey = sourceUid + "-" + config.id;
    
    cacheClient.get(sourceCacheKey, function(err, result) {
        if(err == null && result != null) {
            res.locals.source = JSON.parse(result.toString('utf8'));
            return next();
        } else {
            return next();
        }
    });
}

module.exports = sourceCacheMiddleware;