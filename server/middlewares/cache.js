// ROUTE CACHE MIDDLEWARE
const cacheClient = require("../helpers/cacheClient");

const cacheMiddleware = (cacheTTL = 480) => {
    return (req, res, next) => {
        const reqKey = req.originalUrl;
        if (req.query.cache === 'false') return next();
        cacheClient.get(reqKey, function(err, val) {
            if(err == null && val != null) {
                return res.json(JSON.parse(val.toString('utf8')));
            } else {
                if(err == null) {
                    res.sendResponse = res.send;
                    res.send = (body) => {
                        cacheClient.set(reqKey, body, { ttl: cacheTTL }, function(error) {
                            if(error != null) {
                                // DO NOTHING HERE
                            }
                        });
                        res.sendResponse(body);
                    }
                }
                return next();
            }
        });
      }
    
}

module.exports = cacheMiddleware;