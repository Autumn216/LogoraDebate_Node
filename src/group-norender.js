import React from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import deepMerge from "./utils/deepmerge";
import { Context as ResponsiveContext } from "react-responsive";
import EmbedWrapper from './components/EmbedWrapper';
import GroupEmbed from './components/GroupEmbed';

if(typeof document !== "undefined") {
    if(document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            init();
        });
    }
}

function init() {
    const shortcode_containers = document.querySelectorAll('.logora_embed');
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

const GroupEmbedded = ({ config, resource }) => {
    return (
        <EmbedWrapper config={config}>
             <ResponsiveContext.Provider value={{ deviceWidth: 1000 }}>
                <GroupEmbed
                    group={resource}
                />
            </ResponsiveContext.Provider>
        </EmbedWrapper>
    );
}

function render(container, config) {
    const root = createRoot(container);
    root.render(
        <GroupEmbedded config={config} resource={config.group} />
    );
}

export default GroupEmbedded;