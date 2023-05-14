import { Html, Head, Main, NextScript } from 'next/document'

import i18n from '@/src/config/i18next';
import { AVAILABLE_LANGUAGES } from '@/src/constants/i18next';
import NextDocument from 'next/document'
import theme from '@/src/theme'
import { ColorModeScript } from '@chakra-ui/react';

export default class Document extends NextDocument {
  render() {
    return (
      <Html
        lang={i18n.language}
        dir={
          AVAILABLE_LANGUAGES.find(({ key }) => key === i18n.language)?.dir ??
          'ltr'
        }
      >
        <Head />
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
