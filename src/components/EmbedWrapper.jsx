import React from 'react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { AuthProvider } from "@logora/debate.auth.use_auth";
import { dataProvider, DataProviderContext } from '@logora/debate.data.data_provider';
import { ModalProvider } from '@logora/debate.dialog.modal';
import { ListProvider } from '@logora/debate.list.list_provider';
import { VoteProvider } from '@logora/debate.vote.vote_provider';
import StandardErrorBoundary from "@logora/debate.error.standard_error_boundary";
import { FontInitializer } from '@logora/debate.initializer.font_initializer';
import IntlProviderWrapper from './IntlProviderWrapper';
import EmbedAdInitializer from './ad/EmbedAdInitializer';
import { getRoutes } from "../config/routes";
import { httpClient } from '@logora/debate.data.axios_client';
import "../styles/reset.module.scss";
import cx from 'classnames';

const EmbedWrapper = (props) => {
    const data = dataProvider(httpClient, process.env.API_URL, props.config.api_key, "logora_user_token");

    return (
        <StandardErrorBoundary>
            <div id={"logoraRoot"} className={cx("logoraContainer", {["open_drawer"]: props.config.modules.drawer && props.config.insertType !== 'iframe'})} lang="fr" data-shortname={props.config.shortname} data-id={props.resourceName}>
                <ConfigProvider config={props.config} routes={getRoutes(props.config.routes)} reactRoot="logoraRoot">
                    <DataProviderContext.Provider value={{ dataProvider: data }}>
                        <AuthProvider>
                            <IntlProviderWrapper>
                                <ListProvider>
                                    <VoteProvider>
                                        <ModalProvider>
                                            { typeof window !== 'undefined' ?
                                                <>
                                                    <FontInitializer fontFamilies={[`${props.config.theme.fontFamily || "Montserrat"}:400,700:latin`]} />
                                                    {props.children}
                                                </>
                                            :
                                                <>
                                                    {props.children}
                                                    {(props.resourceName === "group_embed" || props.resourceName == "consultation_embed") && <EmbedAdInitializer />}
                                                </>
                                            }
                                        </ModalProvider>
                                    </VoteProvider>
                                </ListProvider>
                            </IntlProviderWrapper>
                        </AuthProvider>
                    </DataProviderContext.Provider>
                </ConfigProvider>
            </div>
        </StandardErrorBoundary>
    );
}

export default EmbedWrapper;