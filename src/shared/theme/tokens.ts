/**
 * Shared - Theme - Design Tokens
 * 
 * Centralized design system tokens
 * Colors, spacing, typography, shadows, etc.
 */

/**
 * Color Palette
 */
export const colors = {
  // Primary colors
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#007AFF', // Main primary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },

  // Secondary colors
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // Grayscale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  error: {
    light: '#E57373',
    main: '#FF3B30',
    dark: '#D32F2F',
  },
  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },

  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    card: '#FFFFFF',
  },

  // Text colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
    hint: '#BDBDBD',
  },

  // Border colors
  border: {
    light: '#F0F0F0',
    main: '#E0E0E0',
    dark: '#BDBDBD',
  },

  // Utility colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Dark Mode Colors
 */
export const darkColors = {
  ...colors,
  background: {
    default: '#121212',
    paper: '#1E1E1E',
    card: '#2C2C2C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    disabled: '#666666',
    hint: '#757575',
  },
  border: {
    light: '#2C2C2C',
    main: '#3C3C3C',
    dark: '#4C4C4C',
  },
} as const;

/**
 * Spacing Scale
 * Based on 8px grid system
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

/**
 * Typography
 */
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    // Add custom fonts here after loading
    // regular: 'Inter-Regular',
    // medium: 'Inter-Medium',
    // bold: 'Inter-Bold',
  },

  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

/**
 * Border Radius
 */
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

/**
 * Shadows (iOS style)
 */
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
} as const;

/**
 * Z-Index layers
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

/**
 * Animation durations (ms)
 */
export const duration = {
  fast: 150,
  normal: 250,
  slow: 350,
} as const;

/**
 * Breakpoints (for responsive design)
 */
export const breakpoints = {
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Layout constants
 */
export const layout = {
  headerHeight: 56,
  tabBarHeight: 60,
  containerPadding: spacing.md,
  maxContentWidth: 600,
} as const;

/**
 * Export default theme
 */
export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  zIndex,
  duration,
  breakpoints,
  layout,
} as const;

export const darkTheme = {
  ...theme,
  colors: darkColors,
} as const;

export type Theme = typeof theme;

export default theme;
