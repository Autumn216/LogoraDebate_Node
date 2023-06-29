import React from 'react';
import { IntlProvider } from 'react-intl';
import { ContextSourceList } from './ContextSourceList';

export const DefaultContextSourceList = () => {
    const source = [{
        source_url: "#",
        id: 1,
        origin_image_url: "https://picsum.photos/200",
        publisher: "Logora",
        title: "Title of article",
        published_date: "2022-02-25T11:00:00.000Z"
    },
    {
        source_url: "#",
        id: 2,
        origin_image_url: "https://picsum.photos/200",
        publisher: "Logora",
        title: "An another article",
        published_date: "2022-08-11T11:00:00.000Z"
    }]
    return (
        <IntlProvider locale="en">
            <ContextSourceList sources={source} />
        </IntlProvider>
    );
};