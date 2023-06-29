import React from 'react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { IntlProvider } from 'react-intl';
import { BrowserRouter } from 'react-router-dom';
import { Location } from '@logora/debate.util.location';
import { ArgumentHeader } from './ArgumentHeader';
import { faker } from '@faker-js/faker';

const author = {
  image_url: faker.image.avatar(),
  full_name: faker.name.fullName(),
  slug: faker.lorem.slug(),
  points: 52,
  last_activity: new Date(),
  description: faker.name.jobTitle()
}

const date = faker.date.recent();

const routes = {
  userShowLocation: new Location('espace-debat/user/:userSlug', { userSlug: '' })
};

const tag = faker.word.noun(5);

export const DefaultArgumentHeader = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentHeader
            author={author}
            tag={tag}
            date={date}
            positionIndex={1}
            oneLine={false}
            disableLinks={false}
            hideDate={false}
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const ArgumentHeaderWithoutTag = () => {
    return (
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <ArgumentHeader
              author={author}
              date={date}
              positionIndex={1}
              oneLine={false}
              hideDate={false}
            />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};

export const ArgumentHeaderWithoutDate = () => {
    return (
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <ArgumentHeader
              author={author}
              tag={tag}
              positionIndex={1}
              oneLine={false}
              hideDate={true}
            />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
  };
  
export const ArgumentHeaderWithOneLine = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentHeader
            author={author}
            tag={tag}
            positionIndex={1}
            date={date}
            oneLine={true}
            disableLinks={false}
            hideDate={false}
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const ArgumentHeaderWithoutLinks = () => {
    return (
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <ArgumentHeader
              author={author}
              tag={tag}
              date={date}
              oneLine={false}
              disableLinks={true}
              hideDate={false}
            />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};
  