// SETTINGS MIDDLEWARE
const cacheClient = require("../helpers/cacheClient");
const { getSettings } = require("../helpers/logoraRenderAPI");

const settingsMiddleware = function (req, res, next) {
    function deepMerge(target, source) {
        if (target === undefined || target === null) {
            return source;
        }
        for (let k in source) {
            let vs = source[k], vt = target[k];
            if (Object(vs) == vs && Object(vt) === vt) {
                target[k] = deepMerge(vt, vs)
                continue
            }
            target[k] = source[k]
        }
        return target;
    }

    const CONFIG_CACHE_TTL = 3600;
    if(req.baseUrl === '/') return next();
    const shortname = req.query.shortname;
    if(!shortname) return res.status(400).json({success: false, error: "Missing application shortname."});
    const cacheKey = "render-settings-" + shortname;
    cacheClient.get(cacheKey, function(err, result) {
        if(err == null && result != null) {
            const settings = JSON.parse(result.toString('utf8'));
            const config = deepMerge(settings, req.body.config);
            res.locals.config = config;
            return next();
        } else {
            getSettings(shortname).then(response => {
                if(response.data.success) {
                    const localConfig = response.data.data.resource;
                    const config = deepMerge(localConfig, req.body.config);
                    res.locals.config = config;
                    cacheClient.set(cacheKey, JSON.stringify(response.data.data.resource), { ttl: CONFIG_CACHE_TTL }, function(error) {
                        // DO NOTHING
                    });
                    return next();
                } else {
                    return res.end();
                }
            }).catch(error => {
                return res.status(404).json({success: false, error: "Error on settings fetch. Check that the application shortname is correct."});
            });
        }
    });
};

module.exports = settingsMiddleware;
