import React from 'react';
import StandardErrorBoundary from "@logora/debate.error.standard_error_boundary";
import { useCssTheme } from '@logora/debate.hooks.use_css_theme';
import { AuthProvider } from "@logora/debate.auth.use_auth";
import { AuthInitializer } from "@logora/debate.auth.auth_initializer";
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import InputAndListProvider from "../store/InputAndListProvider";
import { ModalProvider } from '@logora/debate.dialog.modal';
import AlertProvider from "../store/AlertProvider";
import AsyncIntlProviderWrapper from './AsyncIntlProviderWrapper';
import { BrowserRouter, HashRouter, StaticRouter } from "react-router-dom";
import { FontInitializer } from '@logora/debate.initializer.font_initializer';
import { MatomoInitializer } from '@logora/debate.initializer.matomo_initializer';
import AdInitializer from './ad/AdInitializer';
import { MemoryRouter } from 'react-router';
import { getRoutes } from "../config/routes";
import { httpClient } from '@logora/debate.data.axios_client';
import { ListProvider } from '@logora/debate.list.list_provider';
import AnnouncementDialog from "@logora/debate.dialog.announcement_dialog";
import styles from './AppWrapper.module.scss';

const AppWrapper = (props) => {
    const data = dataProvider(httpClient, process.env.API_URL, props.config.api_key, "logora_user_token");

    useCssTheme(props.config?.theme, "logoraRoot");

    if(process.env.MAINTENANCE_MODE === "true") {
        return (
            <AnnouncementDialog icon={null} fullWidth={true}>
                {"L'espace de débat est en maintenance pour le moment. Revenez dans quelques minutes !"}
            </AnnouncementDialog>
        )
    }

    const getFontFamilies = (theme) => {
        const fontWeightNormal = theme.fontWeightNormal || "400"
        const fontWeightBold = theme.fontWeightBold || "700"
        let fontFamilies = [];
        if(theme.fontFamily && !theme.fontFamily.includes("var(")) {
            fontFamilies.push(`${theme.fontFamily}:${fontWeightNormal},${fontWeightBold}:latin`)
        }
        if(theme.titleFontFamily && theme.titlefontFamily !== theme.fontFamily && !theme.titleFontFamily.includes("var(")) {
            fontFamilies.push(`${theme.titleFontFamily}:${fontWeightNormal},${fontWeightBold}:latin`)
        }
        if(fontFamilies.length == 0) {
            fontFamilies.push(`Montserrat:${fontWeightNormal},${fontWeightBold}:latin`);
        }
        return fontFamilies;
    }

    const InsideRouter = () => {
        return (
            <AuthProvider>
                <ModalProvider>
                    <AlertProvider>
                        <AuthInitializer authType={props.config.auth?.type} provider={props.config.shortname} assertion={props.config.remote_auth} />
                        { props.config.theme?.useGoogleFonts === false ?
                            null
                        :
                            <FontInitializer fontFamilies={getFontFamilies(props.config.theme)} />
                        }
                        { props.children }
                        { props.disableAnalytics !== true &&
                            <MatomoInitializer matomoUrl={"analytics.logora.fr"} matomoContainerTag={process.env.MATOMO_CONTAINER} />
                        }
                        { props.disableAds !== true &&
                            <AdInitializer />
                        }
                    </AlertProvider>
                </ModalProvider>
            </AuthProvider>
        )
    }

    return (
        <StandardErrorBoundary>
            <div id={"logoraRoot"} className={"logoraContainer"} data-vid={"view_app"} data-shortname={props.config.shortname}>
                <div className={styles.logoraLayout}>
                    <ConfigProvider config={props.config} routes={getRoutes(props.config.routes)}>
                        <AsyncIntlProviderWrapper>
                            <DataProviderContext.Provider value={{ dataProvider: data }}>
                                <InputAndListProvider>
                                    <ListProvider>
                                        { typeof window !== 'undefined' ?
                                            (
                                                <>
                                                    { props.config.routes.router === "hash" ?
                                                        (<>
                                                            {props.config.isDrawer ?
                                                                <MemoryRouter initialEntries={[props.config.initialPath]}>
                                                                    <InsideRouter />
                                                                </MemoryRouter>
                                                            :
                                                                <HashRouter>
                                                                    <InsideRouter />
                                                                </HashRouter>
                                                            }
                                                        </>
                                                        ) : (
                                                            <>
                                                                {props.config.isDrawer ?
                                                                    <MemoryRouter initialEntries={[props.config.initialPath]}>
                                                                        <InsideRouter />
                                                                    </MemoryRouter>
                                                                :
                                                                    <BrowserRouter>
                                                                        <InsideRouter />
                                                                    </BrowserRouter>
                                                                }
                                                            </>
                                                        )}
                                                </>
                                                ) : (
                                                    <StaticRouter location={props.context.path} context={props.context}>
                                                        <AuthProvider>
                                                            <ModalProvider>
                                                                <AlertProvider>
                                                                    { props.children }
                                                                </AlertProvider>
                                                            </ModalProvider>
                                                        </AuthProvider>
                                                    </StaticRouter>
                                            )
                                        }
                                    </ListProvider>
                                </InputAndListProvider>
                            </DataProviderContext.Provider>
                        </AsyncIntlProviderWrapper>
                    </ConfigProvider>
                </div>
            </div>
        </StandardErrorBoundary>
    );
}

export default AppWrapper;