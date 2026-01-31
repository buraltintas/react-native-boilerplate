/**
 * App - Providers - I18n Provider
 * 
 * i18next provider initialization
 */

import React, {useEffect} from 'react';
import {I18nextProvider} from 'react-i18next';
import i18n from '@shared/i18n';
import {useUIStore} from '@shared/store';

interface Props {
  children: React.ReactNode;
}

export function I18nProvider({children}: Props) {
  const language = useUIStore(state => state.language);

  useEffect(() => {
    // Sync i18n language with store
    i18n.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export default I18nProvider;
