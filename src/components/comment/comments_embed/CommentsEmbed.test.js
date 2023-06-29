import React from "react";
import { render, screen } from '@testing-library/react';
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

describe('CommentsEmbed', () => {
    test('should render the component with correct defaults', () => {
        render(
            <BrowserRouter>
                <ConfigProvider config={{}} routes={routes}>
                    <IntlProvider locale="en">
                        <CommentsEmbed source={source} />
                    </IntlProvider>
                </ConfigProvider>
            </BrowserRouter>
        )

        expect(screen.getByText('Give your opinion on this article')).toBeInTheDocument();
		expect(screen.getByText('Read 12 comments')).toBeInTheDocument();

        const link = screen.getByRole('link', { name: 'Read 12 comments' });
		expect(link).toHaveAttribute('href', 'espace-debat/comments/article-uid');
    })

    test('should render the component with top comments', () => {
        const config = { comments: { showTopComments: true }};

        render(
            <BrowserRouter>
                <ConfigProvider config={config} routes={routes}>
                    <IntlProvider locale="en">
                        <CommentsEmbed source={source} />
                    </IntlProvider>
                </ConfigProvider>
            </BrowserRouter>
        )

        expect(screen.queryByText('Give your opinion on this article')).not.toBeInTheDocument();
		expect(screen.getByText('Read 12 comments')).toBeInTheDocument();

        const link = screen.getByRole('link', { name: 'Read 12 comments' });
		expect(link).toHaveAttribute('href', 'espace-debat/comments/article-uid');

        const commentBoxes = screen.getAllByTestId('comment-box');
        expect(commentBoxes.length).toBe(3);

        expect(screen.getByText(source.top_comments[0].author.full_name)).toBeInTheDocument();
        expect(screen.getByText(source.top_comments[1].author.full_name)).toBeInTheDocument();
        expect(screen.getByText(source.top_comments[2].author.full_name)).toBeInTheDocument();

        expect(screen.getByText(source.top_comments[0].content.slice(0, 30), {exact: false})).toBeInTheDocument();
        expect(screen.getByText(source.top_comments[1].content.slice(0, 30), {exact: false})).toBeInTheDocument();
        expect(screen.getByText(source.top_comments[2].content.slice(0, 30), {exact: false})).toBeInTheDocument();
    })
});