import React, { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { httpClient } from '@logora/debate.data.axios_client';
import { dataProvider } from '@logora/debate.data.data_provider';
import { Loader } from '@logora/debate.tools.loader';
import deepMerge from "./utils/deepmerge";
import AppWrapper from './components/AppWrapper';
import CloseDrawer from './components/CloseDrawer';
import { Redirect } from "react-router-dom";

export default function init(shortname, initialPath) {
    const app_container = document.getElementById('logora_app');
    if(shortname) {
        var logoraConfig = {
            shortname: shortname,
            initialPath: initialPath,
            isDrawer: true
        };
        getSettings(app_container, logoraConfig);
    }
}

function getSettings(container, logoraConfig) {
    const api = dataProvider(httpClient, process.env.API_URL);
    api.getSettings(logoraConfig.shortname).then(response => {
        if(response.data.success) {
            const settings = response.data.data.resource;
            const config = deepMerge(settings, logoraConfig);
            if(window["logoraDisplayAds"] === false && config.ads && config.ads.display === true) {
                config.ads.display = false;
            }
            render(container, config);
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
    const App = lazy(() => import(/* webpackPreload: true */ './components/App'));

    const root = createRoot(container);
    root.render(
        <React.Suspense fallback={<div className={"logoraContainer"}><Loader /></div>}>
            <AppWrapper config={config}>
                <CloseDrawer isOpen={() => {true}}>
                        <Redirect to={config.initialPath} />
                        <App />
                </CloseDrawer>
            </AppWrapper>
        </React.Suspense>
    );
}