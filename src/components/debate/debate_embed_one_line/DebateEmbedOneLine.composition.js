import React from "react";
import { DebateEmbedOneLine } from "./DebateEmbedOneLine";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "@logora/debate.context.config_provider";
import { Location } from '@logora/debate.util.location';
import { IntlProvider } from "react-intl";

export const DefaultDebateEmbedOneLine = () => {
    const debate = {
        slug: "custom-slug",
        name: "Custom Debate"
    };

    const routes = {
        debateShowLocation: new Location('espace-debat/debate/:debateSlug', { debateSlug: "" })
    }

    return (
        <BrowserRouter>
            <ConfigProvider config={{}} routes={{ ...routes }}>
                <IntlProvider locale="en">
                    <DebateEmbedOneLine debate={debate} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};