import React from 'react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { IntlProvider } from 'react-intl';
import { AuthorBoxSmall } from './AuthorBoxSmall';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom';
import { faker } from '@faker-js/faker';

const author = {
    image_url: faker.image.avatar(),
    full_name: faker.name.fullName(),
    slug: faker.lorem.slug(),
}

let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })

const routes = {
    userShowLocation: UserShowLocation,
}

export const DefaultAuthorBoxSmall = () => {
    return (
        <BrowserRouter>
            <ConfigProvider routes={{...routes}}>
                <IntlProvider>
                    <AuthorBoxSmall author={author} />
                </IntlProvider>
            </ConfigProvider>
        </BrowserRouter>
    )
};