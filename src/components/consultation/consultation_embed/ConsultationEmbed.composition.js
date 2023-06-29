import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom';
import { ConsultationEmbed } from "./ConsultationEmbed";
import { faker } from '@faker-js/faker';

const routes = {
    consultationShowLocation: new Location('espace-debat/consultation/:consultationSlug', { consultationSlug: "" }),
    userShowLocation: new Location('espace-debat/user/:userSlug', { userSlug: '' })
}

let consultation = {
    id: 19,
    slug: faker.lorem.slug(),
    title: faker.music.songName(),
    description: faker.commerce.productDescription(),
    description_url: "",
    created_at: faker.date.recent(),
    ends_at: faker.date.future(),
    vote_goal: 1000,
    total_votes: 200,
    total_participants: 44,
    online_users_count: 32,
    proposals_count: 53,
    image_url: faker.image.nature(),
    direct_url: faker.internet.url(),
    tags: [
        {
            id: 37,
            name: faker.science.chemicalElement().name,
            taggings_count: 0,
            display_name: faker.science.chemicalElement().name
        },
    ],
    proposals: [
        {
            author: {
                image_url: faker.image.avatar(),
                full_name: faker.name.fullName(),
                slug: faker.lorem.slug(),
                points: 52,
                last_activity: new Date(),
                description: faker.name.jobTitle()
            },
            id: 43,
            created_at: faker.date.recent(),
            content: faker.lorem.sentences(5),
            position: {
                name: faker.lorem.word()
            }
        },
        {
            author: {
                image_url: faker.image.avatar(),
                full_name: faker.name.fullName(),
                slug: faker.lorem.slug(),
                points: 52,
                last_activity: new Date(),
                description: faker.name.jobTitle()
            },
            id: 43,
            created_at: faker.date.recent(),
            content: faker.lorem.sentences(5),
            position: {
                name: faker.lorem.word()
            }
        }
    ]
}

export const DefaultConsultationEmbed = () => {
    return(
        <BrowserRouter>
            <IntlProvider locale="en">
                <ConfigProvider routes={{...routes}} config={{theme:{}}}>
                    <ConsultationEmbed consultation={consultation} />
                </ConfigProvider>
            </IntlProvider>
        </BrowserRouter>
    )
}

export const ConsultationEmbedEmptyProposal = () => {
    consultation.proposals = [];

    return(
        <BrowserRouter>
            <IntlProvider locale="en">
                <ConfigProvider routes={{...routes}} config={{theme:{}}}>
                    <ConsultationEmbed consultation={consultation} />
                </ConfigProvider>
            </IntlProvider>
        </BrowserRouter>
    )
}
