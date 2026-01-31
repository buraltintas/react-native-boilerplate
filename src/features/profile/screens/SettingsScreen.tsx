/**
 * Features - Profile - Screens - Settings
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Switch} from 'react-native';
import {useUIStore} from '@shared/store';
import {useTranslation} from 'react-i18next';
import {SUPPORTED_LANGUAGES} from '@shared/i18n';

export default function SettingsScreen() {
  const {i18n} = useTranslation();
  const {theme, language, setTheme, setLanguage, resetLanguageToDevice} = useUIStore();

  const isDarkMode = theme === 'dark';
  const isSystemTheme = theme === 'system';

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const cycleLanguage = () => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(language);
    const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
    const newLang = SUPPORTED_LANGUAGES[nextIndex];
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleResetLanguage = () => {
    resetLanguageToDevice();
    const deviceLang = useUIStore.getState().language;
    i18n.changeLanguage(deviceLang);
  };

  const getLanguageName = (lang: string) => {
    const names: Record<string, string> = {
      en: 'English',
      tr: 'Türkçe',
    };
    return names[lang] || lang;
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return theme;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Theme</Text>
          <TouchableOpacity style={styles.languageButton} onPress={toggleTheme}>
            <Text style={styles.languageText}>{getThemeLabel()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity style={styles.languageButton} onPress={cycleLanguage}>
              <Text style={styles.languageText}>{getLanguageName(language)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetLanguage}>
              <Text style={styles.resetText}>Reset to Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Current Language</Text>
          <Text style={styles.infoValue}>{language.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  languageContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  languageText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  resetText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});
