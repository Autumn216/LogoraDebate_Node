import React from 'react';
import { IntlProvider } from 'react-intl';
import { CommentContext } from './CommentContext';
import { faker } from '@faker-js/faker';

const source = {
    id: 102,
    uid: faker.lorem.slug(),
    title: faker.music.songName(),
    publisher: faker.vehicle.manufacturer(),
    origin_image_url: faker.image.nature(),
    source_url: faker.internet.url(),
    published_date: faker.date.recent(),
    tags: [
        {
            id: 23,
            name: faker.vehicle.color(),
            taggings_count: 0,
            display_name: faker.vehicle.color()
        }
    ],
    comments_count: 5
}

const sourceWithoutImage = {
    id: 102,
    uid: faker.lorem.slug(),
    title: faker.music.songName(),
    publisher: faker.vehicle.manufacturer(),
    source_url: faker.internet.url(),
    published_date: faker.date.recent(),
    tags: [
        {
            id: 23,
            name: faker.vehicle.color(),
            taggings_count: 0,
            display_name: faker.vehicle.color()
        }
    ]
}

export const DefaultCommentContext = () => {
    return (
        <IntlProvider locale="en">
            <CommentContext source={source} />
        </IntlProvider>
    )
}

const CommentContextWithoutImage = () => {
    return (
        <IntlProvider locale="en">
            <CommentContext source={sourceWithoutImage} />
        </IntlProvider>
    )
}