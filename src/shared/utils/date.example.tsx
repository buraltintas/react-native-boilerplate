/**
 * Example: Using Date Utils
 * 
 * This file shows how to use date utilities
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {dateUtils, DATE_FORMATS} from '@shared/utils/date';
import {useDateFormatter} from '@shared/hooks';

export default function DateUtilsExampleScreen() {
  const {format, formatRelative, formatWithTime, locale} = useDateFormatter();

  const now = new Date();
  const yesterday = dateUtils.manipulate.subDays(now, 1);
  const nextWeek = dateUtils.manipulate.addWeeks(now, 1);
  const apiDate = '2024-01-15T14:30:00Z';

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Date Utils Examples</Text>
      <Text style={styles.subtitle}>Current Locale: {locale}</Text>

      {/* Basic Formatting */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Formatting</Text>
        <Example label="Full" value={format(now, DATE_FORMATS.FULL)} />
        <Example label="Long" value={format(now, DATE_FORMATS.LONG)} />
        <Example label="Medium" value={format(now, DATE_FORMATS.MEDIUM)} />
        <Example label="Short" value={format(now, DATE_FORMATS.SHORT)} />
        <Example label="With Time" value={formatWithTime(now)} />
      </View>

      {/* Relative Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relative Time</Text>
        <Example label="Now" value={formatRelative(now)} />
        <Example label="Yesterday" value={formatRelative(yesterday)} />
        <Example label="Next Week" value={formatRelative(nextWeek)} />
      </View>

      {/* API Date Parsing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Date</Text>
        <Example label="ISO String" value={apiDate} />
        <Example label="Parsed" value={format(apiDate, DATE_FORMATS.LONG_WITH_TIME)} />
        <Example label="Relative" value={formatRelative(apiDate)} />
      </View>

      {/* Date Comparison */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comparisons</Text>
        <Example
          label="Is Today?"
          value={dateUtils.compare.isToday(now) ? 'Yes' : 'No'}
        />
        <Example
          label="Is Future?"
          value={dateUtils.compare.isFuture(nextWeek) ? 'Yes' : 'No'}
        />
        <Example
          label="Is Past?"
          value={dateUtils.compare.isPast(yesterday) ? 'Yes' : 'No'}
        />
      </View>

      {/* Date Manipulation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manipulation</Text>
        <Example
          label="Start of Week"
          value={format(dateUtils.manipulate.startOfWeek(now))}
        />
        <Example
          label="End of Month"
          value={format(dateUtils.manipulate.endOfMonth(now))}
        />
        <Example
          label="Add 3 Months"
          value={format(dateUtils.manipulate.addMonths(now, 3))}
        />
      </View>

      {/* Differences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Differences</Text>
        <Example
          label="Days until next week"
          value={`${dateUtils.difference.inDays(nextWeek, now)} days`}
        />
        <Example
          label="Hours since yesterday"
          value={`${dateUtils.difference.inHours(now, yesterday)} hours`}
        />
      </View>

      {/* Timezone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timezone</Text>
        <Example
          label="UTC"
          value={dateUtils.timezone.format(now, 'UTC', DATE_FORMATS.LONG_WITH_TIME)}
        />
        <Example
          label="New York"
          value={dateUtils.timezone.format(
            now,
            'America/New_York',
            DATE_FORMATS.LONG_WITH_TIME,
          )}
        />
        <Example
          label="Tokyo"
          value={dateUtils.timezone.format(
            now,
            'Asia/Tokyo',
            DATE_FORMATS.LONG_WITH_TIME,
          )}
        />
      </View>
    </ScrollView>
  );
}

function Example({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.example}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  example: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});
