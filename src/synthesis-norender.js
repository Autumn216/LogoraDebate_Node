import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import { Loader } from '@logora/debate.tools.loader';
import deepMerge from "./utils/deepmerge";
import { Context as ResponsiveContext } from "react-responsive";
import { StaticRouter } from "react-router-dom";
import EmbedWrapper from './components/EmbedWrapper';
import GroupEmbed from './components/GroupEmbed';
import { CommentsEmbed } from '@logora/debate.comment.comments_embed';

if( document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
}

function init() {
    const shortcode_containers = document.querySelectorAll('.logora_synthese');
    for (let i = 0; i < shortcode_containers.length; ++i) {
        const objectId = shortcode_containers[i].getAttribute('data-object-id');
        const logoraConfig = window[objectId];

        if(logoraConfig?.shortname) {
            getSettings(shortcode_containers[i], logoraConfig);
        }
    }
}

function getSettings(container, logoraConfig) {
    const api = dataProvider(httpClient, process.env.API_URL);
    api.getSettings(logoraConfig.shortname).then(response => {
        if(response.data.success) {
            const settings = response.data.data.resource;
            render(container, deepMerge(settings, logoraConfig));
            return true;
        } else {
            render(container, logoraConfig);
            return false;
        }
    }).catch(error => {
        console.log("[Logora] Cannot get application settings.");
        return false;
    });
}

function render(container, config) {
    const root = createRoot(container);
    root.render(
        <React.Suspense fallback={<div className={"logoraContainer"}><Loader /></div>}>
            <EmbedWrapper config={config}>
                <ResponsiveContext.Provider value={{ deviceWidth: 1000 }}>
                    <StaticRouter>
                        { config.modules.comments === true && !config.group ?
                                <CommentsEmbed source={config.source} />
                            :
                                <GroupEmbed group={config.group} />
                        }
                    </StaticRouter>
                </ResponsiveContext.Provider>
            </EmbedWrapper>
        </React.Suspense>
    );

    setTimeout((event) => {
        document.querySelectorAll('.open_drawer a').forEach(item => {
            item.setAttribute("data-url", item.href);
            item.href = "#";
            item.addEventListener('click', event => {
                function getURL () {
                    const attr = item.getAttribute("data-url");
                    if (attr) {
                        return attr
                    } else {
                        return "/"
                    }
                }
                import("./index-drawer").then(module => {
                    module.default(config.shortname, getURL());
                })
            })
        });
    }, 1000)
}