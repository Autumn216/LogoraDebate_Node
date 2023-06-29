import React from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import deepMerge from "./utils/deepmerge";
import { Context as ResponsiveContext } from "react-responsive";
import EmbedWrapper from './components/EmbedWrapper';
import { ConsultationEmbed } from "@logora/debate.consultation.consultation_embed";

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

const ConsultationEmbedded = ({ config, resource }) => {
    return (
        <EmbedWrapper config={config}>
             <ResponsiveContext.Provider value={{ deviceWidth: 1000 }}>
                <ConsultationEmbed
                    consultation={resource}
                />
            </ResponsiveContext.Provider>
        </EmbedWrapper>
    );
}

function render(container, config) {
    const root = createRoot(container);
    root.render(
        <ConsultationEmbedded config={config} resource={config.consultation} />
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

export default ConsultationEmbedded;