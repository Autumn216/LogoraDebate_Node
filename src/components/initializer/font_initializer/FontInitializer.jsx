import { useEffect } from 'react';

export const FontInitializer = (props) => {
  useEffect(() => {
    const WebFontLoader = require('webfontloader');
    WebFontLoader.load({
      google: {
        families: props.fontFamilies
      }
    });
  }, [])

  return null;
}