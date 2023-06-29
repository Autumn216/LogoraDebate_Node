import { IntlProvider } from 'react-intl';
import React from 'react';
import flatten from 'flat';
import locales from '../locales';
import { useConfig } from '@logora/debate.context.config_provider';

const IntlProviderWrapper = props => {
  const config = useConfig();

  const setLocale = () => {
    if(config.language) {
      return config.language;
    } else {
      return "fr";
    }
  }

  const locale = setLocale();

  const camelize = (text) => {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return text.substr(0, 1).toLowerCase() + text.substr(1);
  }

  const mergeRemoteMessages = (messages) => {
    let updatedMessages = { ...messages };
    Object.keys(updatedMessages).forEach((k) => {
      const formattedKey = camelize(k);
      if(Object.keys(config.layout).indexOf(formattedKey) > -1) {
        updatedMessages[k] = config.layout[formattedKey];
      }
    });
    return updatedMessages;
  }

  return (
    <IntlProvider locale={locale} messages={mergeRemoteMessages(flatten(locales[locale]))}>
      {props.children}
    </IntlProvider>
  )
};

export default IntlProviderWrapper;