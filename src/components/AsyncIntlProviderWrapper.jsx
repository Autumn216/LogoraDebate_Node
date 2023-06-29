import React, { useEffect } from 'react';
import { IntlProvider } from 'react-intl';
import flatten from 'flat';
import { useConfig } from '@logora/debate.context.config_provider';

const AsyncIntlProviderWrapper = props => {
  const config = useConfig();

  const setLocale = () => {
    if(config.language) {
      return config.language;
    } else {
      return "fr";
    }
  }

  const locale = setLocale();
  const [messages, setMessages] = React.useState(null);

  useEffect(() => {
    (() => import("../locales/" + locale + ".json"))().then((m) => {
      setMessages(m);
    });
  }, []);

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
    <>
      { messages ? 
        (
          <IntlProvider locale={locale} messages={mergeRemoteMessages(flatten(messages))}>
            { props.children }
          </IntlProvider>
        )
      :
        null
      }
    </>
  )
};

export default AsyncIntlProviderWrapper;