/**
 * Shared - Utils - Date
 * 
 * Date/time utilities using date-fns
 * All date operations should go through these helpers
 */

import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  parse,
  parseISO,
  isValid,
  isBefore,
  isAfter,
  isEqual,
  isFuture,
  isPast,
  isToday,
  isYesterday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isThisYear,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInCalendarDays,
} from 'date-fns';
import {formatInTimeZone, toZonedTime, fromZonedTime} from 'date-fns-tz';
import {tr, enUS} from 'date-fns/locale';

/**
 * Supported locales
 */
const LOCALES = {
  en: enUS,
  tr: tr,
};

/**
 * Get locale for date-fns
 */
export function getDateLocale(locale: 'en' | 'tr' = 'en') {
  return LOCALES[locale] || LOCALES.en;
}

/**
 * Format date with locale support
 */
export function formatDate(
  date: Date | number | string,
  formatStr: string = 'PPP',
  locale: 'en' | 'tr' = 'en',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  return format(dateObj, formatStr, {locale: getDateLocale(locale)});
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | number | string,
  locale: 'en' | 'tr' = 'en',
): string {
  return formatDate(date, 'PPp', locale); // Jan 1, 2024, 12:00 PM
}

/**
 * Format time only
 */
export function formatTime(
  date: Date | number | string,
  locale: 'en' | 'tr' = 'en',
  use24Hour: boolean = false,
): string {
  const formatStr = use24Hour ? 'HH:mm' : 'p';
  return formatDate(date, formatStr, locale);
}

/**
 * Format date (short)
 */
export function formatDateShort(
  date: Date | number | string,
  locale: 'en' | 'tr' = 'en',
): string {
  return formatDate(date, 'PP', locale); // Jan 1, 2024
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | number | string,
  locale: 'en' | 'tr' = 'en',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  return formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: getDateLocale(locale),
  });
}

/**
 * Format distance between dates (e.g., "2 hours")
 */
export function formatTimeBetween(
  dateLeft: Date | number | string,
  dateRight: Date | number | string,
  locale: 'en' | 'tr' = 'en',
): string {
  const leftObj = typeof dateLeft === 'string' ? parseISO(dateLeft) : new Date(dateLeft);
  const rightObj = typeof dateRight === 'string' ? parseISO(dateRight) : new Date(dateRight);

  if (!isValid(leftObj) || !isValid(rightObj)) {
    return 'Invalid Date';
  }

  return formatDistance(leftObj, rightObj, {locale: getDateLocale(locale)});
}

/**
 * Format calendar relative (e.g., "yesterday at 5:30 PM")
 */
export function formatCalendarRelative(
  date: Date | number | string,
  baseDate: Date | number = new Date(),
  locale: 'en' | 'tr' = 'en',
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const baseObj = new Date(baseDate);

  if (!isValid(dateObj) || !isValid(baseObj)) {
    return 'Invalid Date';
  }

  return formatRelative(dateObj, baseObj, {locale: getDateLocale(locale)});
}

/**
 * Parse date string
 */
export function parseDate(dateString: string, formatStr?: string): Date | null {
  try {
    if (formatStr) {
      const parsed = parse(dateString, formatStr, new Date());
      return isValid(parsed) ? parsed : null;
    }
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Check if date is valid
 */
export function isValidDate(date: any): boolean {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    return isValid(dateObj);
  } catch {
    return false;
  }
}

/**
 * Comparison helpers
 */
export const dateCompare = {
  isBefore: (date: Date | string, dateToCompare: Date | string) => {
    const d1 = typeof date === 'string' ? parseISO(date) : date;
    const d2 = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isBefore(d1, d2);
  },
  isAfter: (date: Date | string, dateToCompare: Date | string) => {
    const d1 = typeof date === 'string' ? parseISO(date) : date;
    const d2 = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isAfter(d1, d2);
  },
  isEqual: (date: Date | string, dateToCompare: Date | string) => {
    const d1 = typeof date === 'string' ? parseISO(date) : date;
    const d2 = typeof dateToCompare === 'string' ? parseISO(dateToCompare) : dateToCompare;
    return isEqual(d1, d2);
  },
  isFuture: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isFuture(d);
  },
  isPast: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d);
  },
  isToday: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isToday(d);
  },
  isYesterday: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isYesterday(d);
  },
  isTomorrow: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isTomorrow(d);
  },
  isThisWeek: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isThisWeek(d);
  },
  isThisMonth: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isThisMonth(d);
  },
  isThisYear: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isThisYear(d);
  },
};

/**
 * Date manipulation helpers
 */
export const dateManipulate = {
  // Start/End of periods
  startOfDay: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return startOfDay(d);
  },
  endOfDay: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return endOfDay(d);
  },
  startOfWeek: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return startOfWeek(d);
  },
  endOfWeek: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return endOfWeek(d);
  },
  startOfMonth: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return startOfMonth(d);
  },
  endOfMonth: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return endOfMonth(d);
  },
  startOfYear: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return startOfYear(d);
  },
  endOfYear: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return endOfYear(d);
  },

  // Add time
  addDays: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return addDays(d, amount);
  },
  addWeeks: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return addWeeks(d, amount);
  },
  addMonths: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return addMonths(d, amount);
  },
  addYears: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return addYears(d, amount);
  },

  // Subtract time
  subDays: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return subDays(d, amount);
  },
  subWeeks: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return subWeeks(d, amount);
  },
  subMonths: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return subMonths(d, amount);
  },
  subYears: (date: Date | string, amount: number) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return subYears(d, amount);
  },
};

/**
 * Calculate difference between dates
 */
export const dateDifference = {
  inDays: (dateLeft: Date | string, dateRight: Date | string) => {
    const left = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const right = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return differenceInDays(left, right);
  },
  inCalendarDays: (dateLeft: Date | string, dateRight: Date | string) => {
    const left = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const right = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return differenceInCalendarDays(left, right);
  },
  inHours: (dateLeft: Date | string, dateRight: Date | string) => {
    const left = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const right = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return differenceInHours(left, right);
  },
  inMinutes: (dateLeft: Date | string, dateRight: Date | string) => {
    const left = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const right = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return differenceInMinutes(left, right);
  },
  inSeconds: (dateLeft: Date | string, dateRight: Date | string) => {
    const left = typeof dateLeft === 'string' ? parseISO(dateLeft) : dateLeft;
    const right = typeof dateRight === 'string' ? parseISO(dateRight) : dateRight;
    return differenceInSeconds(left, right);
  },
};

/**
 * Timezone helpers
 */
export const timezone = {
  /**
   * Format date in specific timezone
   */
  format: (
    date: Date | string,
    tz: string,
    formatStr: string = 'PPp',
    locale: 'en' | 'tr' = 'en',
  ) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatInTimeZone(d, tz, formatStr, {locale: getDateLocale(locale)});
  },

  /**
   * Convert to timezone
   */
  toZone: (date: Date | string, tz: string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return toZonedTime(d, tz);
  },

  /**
   * Convert from timezone
   */
  fromZone: (date: Date | string, tz: string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return fromZonedTime(d, tz);
  },
};

/**
 * Common format presets
 */
export const DATE_FORMATS = {
  // Full
  FULL: 'PPPP', // Friday, January 1, 2024
  FULL_WITH_TIME: 'PPPPp', // Friday, January 1, 2024 at 12:00 PM

  // Long
  LONG: 'PPP', // January 1, 2024
  LONG_WITH_TIME: 'PPPp', // January 1, 2024, 12:00 PM

  // Medium
  MEDIUM: 'PP', // Jan 1, 2024
  MEDIUM_WITH_TIME: 'PPp', // Jan 1, 2024, 12:00 PM

  // Short
  SHORT: 'P', // 01/01/2024
  SHORT_WITH_TIME: 'Pp', // 01/01/2024, 12:00 PM

  // Time only
  TIME: 'p', // 12:00 PM
  TIME_24H: 'HH:mm', // 13:00

  // Custom
  YEAR_MONTH: 'yyyy-MM', // 2024-01
  MONTH_DAY: 'MMM d', // Jan 1
  DAY_MONTH: 'd MMM', // 1 Jan
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // ISO 8601
} as const;

/**
 * Export all utilities as default object
 */
export const dateUtils = {
  format: formatDate,
  formatDateTime,
  formatTime,
  formatDateShort,
  formatRelativeTime,
  formatTimeBetween,
  formatCalendarRelative,
  parse: parseDate,
  isValid: isValidDate,
  compare: dateCompare,
  manipulate: dateManipulate,
  difference: dateDifference,
  timezone,
  formats: DATE_FORMATS,
};

export default dateUtils;
