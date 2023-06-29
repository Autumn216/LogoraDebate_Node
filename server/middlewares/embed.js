const path = require('path');
const readFile = require('../helpers/readFile');
import EmbedWrapper from "../../src/components/EmbedWrapper";
import { Context as ResponsiveContext} from "react-responsive";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { Link } from '@logora/debate.action.link';
import IntlProviderWrapper from "../../src/components/IntlProviderWrapper";
const { getThemeCss, getFontHtml } = require("../helpers/theme");
import { StaticRouter } from "react-router-dom";

const embedMiddleware = (resourceName, apiFunctionName, getResourceComponent, linkDisabled = false) => {
    return (req, res, next) => {
        const config = res.locals.config;
        if(!config || !config.api_key) return next();
        if(!req.query.id) return res.status(404).json({ success: false, error: "ID parameter is missing." });
        config.insertType = req.query.insertType ? req.query.insertType : "universalCode";
        let id = req.query.id;
        try {
            apiFunctionName(config.api_key, id).then((value) => {
                const resource = value.data.data.resource || value.data.data;
                const html = getHtml(config, resource, resourceName, getResourceComponent, req.query.device, linkDisabled);
                const response = {
                    success: true,
                    resource: {
                        id: resource.id
                    },
                    html: html
                };
                return res.status(200).json(response);
            }).catch(error => {
                if (error.response) {
                    return res.status(error.response.status).json({ success: false });
                } else {
                    return res.status(500).json({ success: false, error: "Data fetching error" });
                }
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: "Internal server error" });
        }
    }
}

function getHtml(config, resource, resourceName, getResourceComponent, deviceType = "desktop", linkDisabled = false) {
    try {
        const containerWidth = getWidthFromDeviceType(deviceType);
        const jsx = (
            <EmbedWrapper config={config} resourceName={resourceName}>
                <ResponsiveContext.Provider value={{ deviceWidth: containerWidth }}>
                    <IntlProviderWrapper>
                        { linkDisabled ?
                            <StaticRouter>
                                { getResourceComponent(resource) }
                            </StaticRouter>
                        :
                            <Link to={resource.direct_url || ""} target="_blank" external>
                                <StaticRouter>
                                    { getResourceComponent(resource) }
                                </StaticRouter>
                            </Link>
                        }
                    </IntlProviderWrapper>
                </ResponsiveContext.Provider>
            </EmbedWrapper>);
        const embedStyles = readFile('./dist/' + resourceName + '.css');
        let html = renderToStaticMarkup(jsx);
        html = prependLinks(html, config);
        const fontLink = getFontHtml(config);
        const themeStyles = getThemeCss(config);
        return (html + fontLink + "<style>" + embedStyles + themeStyles + "</style>");
    } catch(error) {
        console.log(error);
        return Promise.reject();
    }
}

function prependLinks(html, config) {
    const baseUrl = config.provider.url || "";
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
    const outputText = html.replace(/href=(["'])\/(.*?)\1/g, `href=$1${normalizedBaseUrl}/$2$1`);
    return outputText;
}

function getWidthFromDeviceType(deviceType) {
    if(deviceType === "mobile") {
        return 500;
    } else if(deviceType === "tablet") {
        return 600;
    } else if(deviceType === "desktop") {
        return 900;
    } else {
        return 1000;
    }
}

export default embedMiddleware;
export { getHtml };