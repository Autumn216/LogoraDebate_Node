import React from "react";
import { CommentsEmbed } from "./CommentsEmbed";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "@logora/debate.context.config_provider";
import { Location } from '@logora/debate.util.location';
import { IntlProvider } from "react-intl";
import { faker } from '@faker-js/faker';

const source = {
    uid: "article-uid",
    comments_count: 12,
    online_users_count: 130,
    top_comments: [
        {
            id: 1,
            created_at: faker.date.recent(),
            content: faker.lorem.sentences(4),
            author: {
                image_url: faker.image.avatar(),
                full_name: faker.name.fullName(),
                slug: faker.lorem.slug(),
                points: 52,
                last_activity: new Date(),
                description: faker.name.jobTitle()
            }
        },
        {
            id: 2,
            created_at: faker.date.recent(),
            content: faker.lorem.sentences(4),
            author: {
                image_url: faker.image.avatar(),
                full_name: faker.name.fullName(),
                slug: faker.lorem.slug(),
                points: 132,
                last_activity: new Date(),
                description: faker.name.jobTitle()
            }
        },
        {
            id: 3,
            created_at: faker.date.recent(),
            content: faker.lorem.sentences(4),
            author: {
                image_url: faker.image.avatar(),
                full_name: faker.name.fullName(),
                slug: faker.lorem.slug(),
                points: 178,
                last_activity: new Date(),
                description: faker.name.jobTitle()
            }
        }
    ]
};

const routes = {
    commentShowLocation: new Location('espace-debat/comments/:articleUid', { articleUid: "" }),
    userShowLocation: new Location('espace-debat/user/:userSlug', { userSlug: "" })
}

export const DefaultCommentsEmbed = () => {
    return (
        <BrowserRouter>
            <ConfigProvider config={{}} routes={routes}>
                <IntlProvider locale="en">
                    <CommentsEmbed source={source} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export const CommentsEmbedWithTopComments = () => {
    const config = { comments: { showTopComments: true }};

    return (
        <BrowserRouter>
            <ConfigProvider config={config} routes={routes}>
                <IntlProvider locale="en">
                    <CommentsEmbed source={source} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    );
};