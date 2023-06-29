import React from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import deepMerge from "./utils/deepmerge";
import { Context as ResponsiveContext } from "react-responsive";
import EmbedWrapper from './components/EmbedWrapper';
import Argument from './components/Argument';
import { Link } from '@logora/debate.action.link';

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

const ArgumentEmbed = ({ config, resource }) => {
    return (
        <EmbedWrapper config={config}>
             <ResponsiveContext.Provider value={{ deviceWidth: 1000 }}>
                <Link to={resource.direct_url} external target="_blank">
                    <Argument
                        nestingLevel={0}
                        positionIndex={0}
                        debateIsActive={true}
                        debateSlug={null}
                        argument={resource}
                        hideReplies={true}
                        expandable={true}
                        disableLinks={true}
                        fixedContentHeight={false}
                        debatePositions={resource.group.group_context.positions}
                    />
                </Link>
            </ResponsiveContext.Provider>
        </EmbedWrapper>
    );
}

function render(container, config) {
    const root = createRoot(container);
    root.render(
        <ArgumentEmbed config={config} resource={config.argument} />
    );
}

export default ArgumentEmbed;