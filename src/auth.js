import React from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import { AuthInitializer } from '@logora/debate.auth.auth_initializer';
import deepMerge from "./utils/deepmerge";
import AppWrapper from './components/AppWrapper';
import filterConfig from './utils/filterConfig';

if( document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        init();
    });
}

function init() {
    const app_container = document.getElementById('logora_app');
    const objectId = "logora_config";
    const logoraConfig = window[objectId];

    if(logoraConfig?.shortname) {
        getSettings(app_container, logoraConfig);
    }
}

function getSettings(container, logoraConfig) {
    const api = dataProvider(httpClient, process.env.API_URL);
    api.getSettings(logoraConfig.shortname).then(response => {
        if(response.data.success) {
            const settings = response.data.data.resource;
            const config = deepMerge(settings, filterConfig(logoraConfig));
            render(container, config);
            return true;
        } else {
            render(container, logoraConfig);
            return false;
        }
    }).catch(error => {
        render(container, logoraConfig);
        return false;
    });
}

function render(container, config) {
    const root = createRoot(container);
    root.render(
        <AppWrapper config={config} disableAnalytics disableAds>
            <AuthInitializer authType={config.auth?.type} provider={config.shortname} />
        </AppWrapper>
    );
}