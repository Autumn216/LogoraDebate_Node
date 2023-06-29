const URLSearchParams = require("@ungap/url-search-params");
const readFile = require('../helpers/readFile');
const path = require('path');
import { Context as ResponsiveContext } from "react-responsive";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import App from "../../src/components/App";
import AppWrapper from "../../src/components/AppWrapper";
import IntlProviderWrapper from "../../src/components/IntlProviderWrapper";
const settingsMiddleware = require('../middlewares/settings');
import appRouterMiddleware from '../middlewares/appRouter';
const { ChunkExtractor } = require("@loadable/server");
const { getThemeCss, getFontHtml } = require("../helpers/theme");
const { getList, getDebate, getDebateArguments, getRelatedDebates, getUser, getConsultation } = require("../helpers/logoraRenderAPI");

const express = require('express');
const router = express.Router();

const statsFile = path.resolve(path.join(__dirname, "..", "dist/loadable-stats.json"));
const commonStyles = readFile('./dist/app.css');
const textEditorStyles = readFile('./dist/ArgumentInput.css');

/**
 * @openapi
 * /app:
 *   get:
 *     tags:
 *       - pre-rendering
 *     summary: Debate space pre-rendering endpoint
 *     description: Get the HTML rendering of a debate space page
 *     parameters:
 *       - name: shortname
 *         description: 'Application shortname available in the Logora Admin Panel'
 *         in: query
 *         type: string
 *         required: true
 *       - name: url
 *         description: 'URL of the page to render'
 *         in: query
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: HTML and metadata of the rendered page
 *         examples: 
 *           success: true
 *           title: 'Debate space - My debate'
 *           description: 'Description of the page'
 *           content: '<div id="logoraRoot">...</div>'
 */
router.get('/', settingsMiddleware, appRouterMiddleware, (req, res) => {
    const config = res.locals.config;
    if(!config || !config.api_key) return next();
    const route = res.locals.appRoute;
    const path = res.locals.appPath;
    const req_url = res.locals.appReqUrl;
    const context = { path: path };
    try {
        if (route) {
            const routeName = route.name;
            if (routeName === 'indexLocation' || routeName === 'rootLocation') {
                Promise.all([
                    getList(config.api_key, "groups", 1, 7),
                    getList(config.api_key, "users/index/trending", 1, 10),
                    getList(config.api_key, "tags", 1, 4, "", "-created_at", 0, {}, true)
                ]).then((values) => {
                    context["mainDebate"] = values[0].data.data[0];
                    context["getTrendingDebates"] = values[0].data.data.slice(1);
                    context["getBestUsers"] = values[1].data.data;
                    context["getApplicationTags"] = values[2].data.data.slice(0, 4);
                    const result = getAppHtml(config, context, "Index");
                    const title = "L'espace de débat - " + config.provider.name;
                    const description = "Participez aux derniers débats sur " + config.provider.name + " et retrouvez les meilleurs débatteurs."
                    const response = buildResponse(result, title, description, "", 300, 700);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else if (routeName === 'debateShowLocation') {
                const debateSlug = route.params.debateSlug;
                Promise.all([
                    getDebate(config.api_key, debateSlug),
                    getDebateArguments(config.api_key, debateSlug, 1, "-score", 5, null),
                    getList(config.api_key, `/groups/${debateSlug}/related`, 1, 6, "", "-created_at", 0, {}, true)
                ]).then((values) => {
                    context["getDebate"] = values[0].data.data.resource;
                    context["getDebateArguments"] = values[1].data.data;
                    context["getRelatedDebates"] = values[2].data.data;
                    const result = getAppHtml(config, context, "Debate");
                    const title = "Débat : " + context["getDebate"].name + " - L'espace de débat";
                    const description = "Participez au débat sur " + config.provider.name + " et retrouvez les meilleurs arguments."
                    const response = buildResponse(result, title, description);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else if (routeName === 'userShowLocation') {
                const userSlug = route.params.userSlug;
                Promise.all([
                    getUser(config.api_key, userSlug),
                    getList(config.api_key, "users/" + userSlug + "/messages", 1, 5),
                ]).then((values) => {
                    context["getUser"] = values[0].data.data.resource;
                    context["getUserMessages"] = values[1].data.data;
                    const result = getAppHtml(config, context, "User");
                    const title = context["getUser"].full_name + " - L'espace de débat";
                    const description = "Retrouvez le profil de " + context["getUser"].full_name + " sur " + config.provider.name + " et explorez ses derniers arguments."
                    const response = buildResponse(result, title, description);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else if(routeName === 'consultationShowLocation') {
                const consultationSlug = route.params.consultationSlug;
                Promise.all([
                    getConsultation(config.api_key, consultationSlug),
                    getList(config.api_key, "proposals", 1, 10),
                ]).then((values) => {
                    context["getConsultation"] = values[0].data.data.resource;
                    context["getProposals"] = values[1].data.data;
                    const result = getAppHtml(config, context, "Consultation");
                    const title = "Consultation : " + context["getConsultation"].name + " - L'espace de débat";
                    const description = "Participez à la consultation sur " + config.provider.name + " et retrouvez les meilleures idées."
                    const response = buildResponse(result, title, description);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else if(routeName === 'consultationIndexLocation') {
                Promise.all([
                    getList(config.api_key, "consultations", 1, 10),
                ]).then((values) => {
                    context["getConsultations"] = values[0].data.data;
                    const result = getAppHtml(config, context, "ConsultationIndex");
                    const title = "Consultations " + config.provider.name;
                    const description = "Participez aux dernières consultations sur " + config.provider.name + " et retrouvez les meilleures idées."
                    const response = buildResponse(result, title, description);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else if (routeName === 'searchLocation') {
                const url_params = new URLSearchParams(req_url);
                const searchQuery = url_params.get("q");
                Promise.all([
                    getList(config.api_key, 'groups', 1, 10, searchQuery),
                    getList(config.api_key, 'users', 1, 10, searchQuery)
                ]).then((values) => {
                    context["getDebateResults"] = values[0].data.data;
                    const result = getAppHtml(config, context, "Search");
                    const title = "L'espace de débat - " + config.provider.name;
                    const description = "Recherchez les derniers débats et les meilleurs débatteurs sur " + config.provider.name;
                    const response = buildResponse(result, title, description);
                    return res.json(response);
                }).catch(error => {
                    if (error.response && error.response.data) {
                        return res.status(error.response.status).json(error.response.data);
                    } else {
                        return res.status(500).json({success: false});
                    }
                });
            } else {
                return res.status(404).json({success: false, error: "Page not found"});
            }
        } else {
            return res.status(404).json({success: false, error: "Page not found"});
        }
    } catch (error) {
        return res.status(500).json({success: false, error: "Internal server error"});
    }
});

function getAppHtml(config, context, moduleName) {
    try {
        const extractor = new ChunkExtractor({ statsFile, entrypoints: [moduleName] });
        const jsx = extractor.collectChunks(
            <AppWrapper config={config} context={context}>
                <IntlProviderWrapper>
                    <ResponsiveContext.Provider value={{ deviceWidth: 550 }}>
                        <App/>
                    </ResponsiveContext.Provider>
                </IntlProviderWrapper>
            </AppWrapper>);
        const html = renderToStaticMarkup(jsx);
        const themeStyles = getThemeCss(config);
        const fontLink = getFontHtml(config);
        const styles = readFile('./dist/' + moduleName + '.css');
        let commonCssString = commonStyles + themeStyles;
        if(moduleName == "Debate" || moduleName == "Consultation") {
            commonCssString += textEditorStyles;
        }
        const htmlWithStyles = html + fontLink + "<style>" + styles + commonCssString + "</style>";
        return htmlWithStyles;
    } catch(error) {
        console.log(error);
        return Promise.reject();
    }
}

function buildResponse(content, title, description, image_url = "", image_height = "", image_width = "") {
    return {
        success: true,
        title: title,
        description: description,
        content: content,
        image: {
            url: image_url,
            height: image_height,
            width: image_width
        }
    };
}

export default router;