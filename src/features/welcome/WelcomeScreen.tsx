/**
 * Features - Welcome - Welcome Screen
 * 
 * Modern iOS-style welcome screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useTheme} from '@shared/theme';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function WelcomeScreen({navigation}: Props) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const features = [
    {
      icon: '🚀',
      title: 'Modern Architecture',
      description: 'Clean, scalable, production-ready codebase',
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'iOS-inspired UI with dark mode support',
    },
    {
      icon: '🔐',
      title: 'Secure Auth',
      description: 'Complete authentication flow with token management',
    },
    {
      icon: '🌐',
      title: 'Multi-language',
      description: 'Built-in i18n support with EN/TR',
    },
    {
      icon: '⚡️',
      title: 'Smooth Animations',
      description: '60fps animations with Reanimated',
    },
    {
      icon: '📱',
      title: 'Push Notifications',
      description: 'Complete push notification system',
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background.default}]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={[styles.logoContainer, {backgroundColor: colors.primary[500]}]}>
            <Text style={styles.logo}>RN</Text>
          </View>
          <Text style={[styles.title, {color: colors.text.primary}]}>
            React Native Boilerplate
          </Text>
          <Text style={[styles.subtitle, {color: colors.text.secondary}]}>
            Production-ready mobile app template
          </Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View
              key={index}
              style={[styles.featureCard, {backgroundColor: colors.background.card}]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={[styles.featureTitle, {color: colors.text.primary}]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, {color: colors.text.secondary}]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={[styles.statCard, {backgroundColor: colors.background.card}]}>
            <Text style={[styles.statNumber, {color: colors.primary[500]}]}>10k+</Text>
            <Text style={[styles.statLabel, {color: colors.text.secondary}]}>
              Lines of Code
            </Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.background.card}]}>
            <Text style={[styles.statNumber, {color: colors.success}]}>100%</Text>
            <Text style={[styles.statLabel, {color: colors.text.secondary}]}>
              TypeScript
            </Text>
          </View>
          <View style={[styles.statCard, {backgroundColor: colors.background.card}]}>
            <Text style={[styles.statNumber, {color: colors.warning}]}>15+</Text>
            <Text style={[styles.statLabel, {color: colors.text.secondary}]}>
              Features
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, {backgroundColor: colors.primary[500]}]}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.primaryButtonText}>{t('common.getStarted')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {borderColor: colors.border.main, backgroundColor: colors.background.card},
            ]}
            onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.secondaryButtonText, {color: colors.text.primary}]}>
              {t('auth.signup')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, {color: colors.text.disabled}]}>
          Built with ❤️ for modern mobile apps
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 48,
  },
  featureCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 48,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  ctaContainer: {
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
  },
});
