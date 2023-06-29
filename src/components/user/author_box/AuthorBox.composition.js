import React from 'react';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { IntlProvider } from 'react-intl';
import { AuthorBox } from './AuthorBox';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom';
import { faker } from '@faker-js/faker';

const author = {
  image_url: faker.image.avatar(),
  full_name: faker.name.fullName(),
  slug: faker.lorem.slug(),
  points: 52,
  last_activity: new Date(),
  description: faker.name.jobTitle()
};

const routes = {
  userShowLocation: new Location('espace-debat/user/:userSlug', { userSlug: '' })
};

export const DefaultAuthorBox = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <AuthorBox author={author} />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const AuthorBoxWithoutLink = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <AuthorBox author={author} disableLinks={true} />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const AuthorBoxWithTitle = () => {
    return (
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <AuthorBox author={{ ...author, eloquence_title: faker.name.jobType() }} />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};

export const AuthorBoxWithDescription = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <AuthorBox author={author} showDescription={true} />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const AuthorBoxWithOccupation = () => {
    return (
      <BrowserRouter>
        <ConfigProvider routes={{ ...routes }}>
          <IntlProvider locale="en">
            <AuthorBox author={{ ...author, occupation: faker.name.jobTitle() }} />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};

export const AuthorBoxWithoutUserInfo = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <AuthorBox author={author} hideUserInfo={true} />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};