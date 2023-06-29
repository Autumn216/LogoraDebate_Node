// APP ROUTER MIDDLEWARE
const url = require("url");
import { matchPath } from "react-router";
import { getRoutes } from "../../src/config/routes";

export default function(req, res, next) {
    const config = res.locals.config;
    const req_url = new URL(req.query.url);
    const cleanedUrl = `${req_url.origin}${req_url.pathname}`
    const path = getPath(cleanedUrl);
    if(!req_url) {
        return res.status(400).json({success: false, error: 'Required parameter "url" not defined.'});
    }
    if(!config || !config.routes) {
        return res.status(404).json({success: false, error: "Config not found"});
    } else {
        const route = matchRoute(path, config.routes);
        if(!route) {
            return res.status(404).json({success: false, error: "Route not found"});
        } else {
            res.locals.appRoute = route;
            res.locals.appPath = path;
            res.locals.appReqUrl = cleanedUrl;
            return next();
        }
    }
}

function matchRoute(path, routeConfig) {
    const routes = getRoutes(routeConfig);
    let foundPath = null;
    Object.entries(routes).every((element, index) => {
        const isMatch = matchPath(path, {
            path: element[1].path,
            exact: true,
            strict: false
        });
        if(isMatch && isMatch.isExact) {
            foundPath = isMatch;
            isMatch['name'] = element[0];
            return false;
        }
        return true;
    })
    return foundPath;
}

function getPath(match_url) {
    const url_parts = url.parse(match_url);
    return url_parts.pathname;
}