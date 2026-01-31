/**
 * Example: Using Theme System
 * 
 * This is an example component showing how to use the theme system
 */

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme, styleUtils} from '@shared/theme';

export default function ThemedExampleScreen() {
  const {colors, spacing, typography, shadows, borderRadius} = useTheme();

  return (
    <View style={[styleUtils.container.screenPadded]}>
      {/* Using theme hook directly */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background.card,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
          },
          shadows.md,
        ]}>
        <Text style={{color: colors.text.primary, fontSize: typography.fontSize.xl}}>
          Themed Card
        </Text>
        <Text style={{color: colors.text.secondary, fontSize: typography.fontSize.base}}>
          This card uses theme values
        </Text>
      </View>

      {/* Using style utils */}
      <View style={[styleUtils.container.card, styleUtils.spacing.mt2]}>
        <Text style={[styleUtils.text.lg, styleUtils.text.bold]}>Style Utils</Text>
        <Text style={[styleUtils.text.base, styleUtils.spacing.mt1]}>
          Pre-built utility styles
        </Text>
      </View>

      {/* Flex utilities */}
      <View style={[styleUtils.flex.rowBetween, styleUtils.spacing.mt2]}>
        <Text>Left</Text>
        <Text>Right</Text>
      </View>

      {/* Button with theme */}
      <TouchableOpacity
        style={[
          styleUtils.button.primary,
          styleUtils.spacing.mt2,
          {backgroundColor: colors.primary[500]},
        ]}>
        <Text style={{color: colors.white, fontWeight: typography.fontWeight.semibold}}>
          Themed Button
        </Text>
      </TouchableOpacity>

      {/* Custom styled with theme */}
      <View
        style={[
          styles.customBox,
          {
            borderColor: colors.primary[500],
            backgroundColor: colors.primary[50],
          },
        ]}>
        <Text style={{color: colors.primary[700]}}>Custom Themed Element</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  customBox: {
    marginTop: 16,
    padding: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
});
