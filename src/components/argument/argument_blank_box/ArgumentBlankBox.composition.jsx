import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { BrowserRouter } from 'react-router-dom';
import { Location } from '@logora/debate.util.location';
import { ArgumentBlankBox } from './ArgumentBlankBox';
import { faker } from '@faker-js/faker';

const debateUrl = faker.internet.url();

const position = {
    id: 34,
    name: faker.lorem.word()
}

const routes = {
  debateShowLocation: new Location('espace-debat/debate/:debateSlug', { debateSlug: '' })
};

const config = {};

export const DefaultArgumentBox = () => {
  return (
    <BrowserRouter>
      <ConfigProvider config={config} routes={{ ...routes }}>
        <IntlProvider locale="en">
          <ArgumentBlankBox
            debateUrl={debateUrl}
            position={position}
          />
        </IntlProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};


export const ArgumentBoxNoPosition = () => {
    return (
      <BrowserRouter>
        <ConfigProvider config={config} routes={{ ...routes }}>
          <IntlProvider locale="en">
            <ArgumentBlankBox
              debateUrl={debateUrl}
            />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};

export const ArgumentBoxWithoutLineBottom = () => {
    return (
      <BrowserRouter>
        <ConfigProvider config={config} routes={{ ...routes }}>
          <IntlProvider locale="en">
            <ArgumentBlankBox
              debateUrl={debateUrl}
              oneLineBottom={false}
            />
          </IntlProvider>
        </ConfigProvider>
      </BrowserRouter>
    );
};