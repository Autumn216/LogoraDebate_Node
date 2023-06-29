import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { BrowserRouter } from 'react-router-dom';
import { Location } from '@logora/debate.util.location';
import { ArgumentBox } from './ArgumentBox';
import { faker } from '@faker-js/faker';

const author = {
  image_url: faker.image.avatar(),
  full_name: faker.name.fullName(),
  slug: faker.lorem.slug(),
  points: 52,
  last_activity: new Date(),
  description: faker.name.jobTitle()
}

const argument = {
  id: 43,
  author: author,
  created_at: faker.date.recent(),
  content: faker.lorem.sentences(5),
  position: {
    name: faker.lorem.word()
  }
}

const debateUrl = faker.internet.url();

const routes = {
  userShowLocation: new Location('espace-debat/user/:userSlug', { userSlug: '' })
};

export const DefaultArgumentBox = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentBox
            author={author} 
            tag={argument.position?.name}
            date={argument.created_at}
            content={argument.content}
            link={debateUrl}
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};


export const ArgumentBoxWithTitle = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentBox
            author={author} 
            tag={argument.position?.name}
            title={"My argument title"}
            date={argument.created_at}
            content={argument.content}
            link={debateUrl}
            showFooter
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};


export const ArgumentBoxWithFooter = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentBox
            author={author} 
            tag={argument.position?.name}
            date={argument.created_at}
            content={argument.content}
            link={debateUrl}
            showFooter
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export const ArgumentBoxHeaderOneLine = () => {
  return (
    <BrowserRouter>
      <ConfigProvider routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentBox
            author={author} 
            tag={argument.position?.name}
            date={argument.created_at}
            content={argument.content}
            link={debateUrl}
            headerOneLine={true}
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};
