/**
 * Shared - Theme - Style Utilities
 * 
 * Reusable style utilities and helpers
 */

import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {theme} from './tokens';

/**
 * Common flex layouts
 */
export const flexStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
});

/**
 * Common spacing
 */
export const spacingStyles = StyleSheet.create({
  // Padding
  p0: {padding: theme.spacing.xs},
  p1: {padding: theme.spacing.sm},
  p2: {padding: theme.spacing.md},
  p3: {padding: theme.spacing.lg},
  p4: {padding: theme.spacing.xl},

  // Padding horizontal
  px0: {paddingHorizontal: theme.spacing.xs},
  px1: {paddingHorizontal: theme.spacing.sm},
  px2: {paddingHorizontal: theme.spacing.md},
  px3: {paddingHorizontal: theme.spacing.lg},
  px4: {paddingHorizontal: theme.spacing.xl},

  // Padding vertical
  py0: {paddingVertical: theme.spacing.xs},
  py1: {paddingVertical: theme.spacing.sm},
  py2: {paddingVertical: theme.spacing.md},
  py3: {paddingVertical: theme.spacing.lg},
  py4: {paddingVertical: theme.spacing.xl},

  // Margin
  m0: {margin: theme.spacing.xs},
  m1: {margin: theme.spacing.sm},
  m2: {margin: theme.spacing.md},
  m3: {margin: theme.spacing.lg},
  m4: {margin: theme.spacing.xl},

  // Margin bottom
  mb0: {marginBottom: theme.spacing.xs},
  mb1: {marginBottom: theme.spacing.sm},
  mb2: {marginBottom: theme.spacing.md},
  mb3: {marginBottom: theme.spacing.lg},
  mb4: {marginBottom: theme.spacing.xl},

  // Margin top
  mt0: {marginTop: theme.spacing.xs},
  mt1: {marginTop: theme.spacing.sm},
  mt2: {marginTop: theme.spacing.md},
  mt3: {marginTop: theme.spacing.lg},
  mt4: {marginTop: theme.spacing.xl},

  // Gap (for containers with gap support)
  gap0: {gap: theme.spacing.xs},
  gap1: {gap: theme.spacing.sm},
  gap2: {gap: theme.spacing.md},
  gap3: {gap: theme.spacing.lg},
  gap4: {gap: theme.spacing.xl},
});

/**
 * Common text styles
 */
export const textStyles = StyleSheet.create({
  // Size variants
  xs: {
    fontSize: theme.typography.fontSize.xs,
  },
  sm: {
    fontSize: theme.typography.fontSize.sm,
  },
  base: {
    fontSize: theme.typography.fontSize.base,
  },
  md: {
    fontSize: theme.typography.fontSize.md,
  },
  lg: {
    fontSize: theme.typography.fontSize.lg,
  },
  xl: {
    fontSize: theme.typography.fontSize.xl,
  },
  xxl: {
    fontSize: theme.typography.fontSize.xxl,
  },

  // Weight variants
  regular: {
    fontWeight: theme.typography.fontWeight.regular,
  },
  medium: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  semibold: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  bold: {
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Alignment
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
});

/**
 * Common container styles
 */
export const containerStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardFlat: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  section: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  screenPadded: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.md,
  },
});

/**
 * Common button styles
 */
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: theme.colors.gray[200],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary[500],
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
});

/**
 * Common input styles
 */
export const inputStyles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: theme.colors.border.main,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    backgroundColor: theme.colors.white,
  },
  focused: {
    borderColor: theme.colors.primary[500],
  },
  error: {
    borderColor: theme.colors.error.main,
  },
  disabled: {
    backgroundColor: theme.colors.gray[100],
    color: theme.colors.text.disabled,
  },
});

/**
 * Helper function to create themed styles
 */
export function createThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  stylesFn: (colors: typeof theme.colors) => T,
) {
  return (colors: typeof theme.colors) => StyleSheet.create(stylesFn(colors));
}

/**
 * Helper function to merge styles
 */
export function mergeStyles(...styles: (ViewStyle | TextStyle | undefined)[]) {
  return styles.filter(Boolean);
}

/**
 * Export all utilities
 */
export const styleUtils = {
  flex: flexStyles,
  spacing: spacingStyles,
  text: textStyles,
  container: containerStyles,
  button: buttonStyles,
  input: inputStyles,
  merge: mergeStyles,
};

export default styleUtils;
