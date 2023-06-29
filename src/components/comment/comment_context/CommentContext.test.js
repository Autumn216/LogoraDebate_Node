import React from "react";
import { CommentContext } from "./CommentContext";
import { IntlProvider } from "react-intl";
import { render } from '@testing-library/react';
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

it ('renders CommentContext component', () => {  
    const { getByText } = render(
        <IntlProvider locale="en">
            <CommentContext source={source} />
        </IntlProvider>
    );
    expect(getByText(source.title)).toBeInTheDocument();
})

it ('renders correct image source if origin_image_url is provided', () => {  
    const { getByText } = render(
        <IntlProvider locale="en">
            <CommentContext source={source} />
        </IntlProvider>
    );
    
    const displayedImage = document.querySelector("img");
    expect(displayedImage.src).toContain(source.origin_image_url);
})

it ('renders display no image if origin_image_url is not provided', () => {  
    const { getByText } = render(
        <IntlProvider locale="en">
            <CommentContext source={sourceWithoutImage} />
        </IntlProvider>
    );
    
    const displayedImage = document.querySelector("img");
    expect(displayedImage).toBeFalsy();
})