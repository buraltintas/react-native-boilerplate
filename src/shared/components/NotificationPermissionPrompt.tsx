/**
 * Shared - Components - NotificationPermissionPrompt
 * 
 * User-friendly notification permission request
 */

import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {useTheme} from '@shared/theme';
import {useNotifications} from '@shared/hooks';

interface NotificationPermissionPromptProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function NotificationPermissionPrompt({
  visible,
  onClose,
  title = 'Enable Notifications',
  message = 'Stay updated with real-time notifications. We\'ll only send you important updates.',
}: NotificationPermissionPromptProps) {
  const {colors} = useTheme();
  const {requestPermissions} = useNotifications();

  const handleEnable = async () => {
    const granted = await requestPermissions();
    if (granted) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, {backgroundColor: colors.background.card}]}>
          <Text style={[styles.icon, {color: colors.primary[500]}]}>🔔</Text>
          
          <Text style={[styles.title, {color: colors.text.primary}]}>
            {title}
          </Text>
          
          <Text style={[styles.message, {color: colors.text.secondary}]}>
            {message}
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, {borderColor: colors.border.main}]}
              onPress={onClose}>
              <Text style={[styles.buttonText, {color: colors.text.secondary}]}>
                Not Now
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, {backgroundColor: colors.primary[500]}]}
              onPress={handleEnable}>
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                Enable
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
});

export default NotificationPermissionPrompt;
