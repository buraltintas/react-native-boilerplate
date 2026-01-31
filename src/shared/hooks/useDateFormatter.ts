/**
 * Shared - Hooks - useDateFormatter
 * 
 * Hook for formatting dates with current locale
 */

import {useCallback} from 'react';
import {useUIStore} from '@shared/store';
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatDateShort,
  formatRelativeTime,
} from '@shared/utils/date';

export function useDateFormatter() {
  const language = useUIStore(state => state.language);

  const format = useCallback(
    (date: Date | string, formatStr?: string) => {
      return formatDate(date, formatStr, language);
    },
    [language],
  );

  const formatWithTime = useCallback(
    (date: Date | string) => {
      return formatDateTime(date, language);
    },
    [language],
  );

  const formatTimeOnly = useCallback(
    (date: Date | string, use24Hour = false) => {
      return formatTime(date, language, use24Hour);
    },
    [language],
  );

  const formatShort = useCallback(
    (date: Date | string) => {
      return formatDateShort(date, language);
    },
    [language],
  );

  const formatRelative = useCallback(
    (date: Date | string) => {
      return formatRelativeTime(date, language);
    },
    [language],
  );

  return {
    format,
    formatWithTime,
    formatTimeOnly,
    formatShort,
    formatRelative,
    locale: language,
  };
}

export default useDateFormatter;
