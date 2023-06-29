import React from "react";
import { IntlProvider } from 'react-intl';
import { ConsultationContext } from "./ConsultationContext";
import { ConfigProvider } from '@logora/debate.context.config_provider';

export const DefaultConsultationContext = () => {
    const consultation = {
        id: 19,
        slug: "festivals-quelle-serait-votre-programmation-de-reve",
        title: "Festivals: quelle serait votre programmation de rêve ?",
        description: "Consultation de rêve",
        description_url: "",
        created_at: "2022-11-24T15:20:51.727Z",
        ends_at: "2023-10-30T00:00:00.000Z",
        vote_goal: 1000,
        total_votes: 2,
        total_participants: 4,
        proposals_count: 53,
        image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/consultations/banner_8e9d9ab1cdf82a80c2315488195e1fc8.png",
        direct_url: "https://test.logora.fr/#/consultation/festivals-quelle-serait-votre-programmation-de-reve",
        tags: [
            {
                id: 37,
                name: "musique",
                taggings_count: 0,
                display_name: "musique"
            },
        ],
    }

    return (
        <IntlProvider locale="en">
            <ConfigProvider config={{theme:{}}}>
                <ConsultationContext consultation={consultation} />
            </ConfigProvider>
        </IntlProvider>
    )
}