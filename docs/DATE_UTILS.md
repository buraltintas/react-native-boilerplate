# Date & Time Utilities

Bu döküman, date/time işlemleri için kullanılan utility'leri açıklar.

## 📦 Kütüphane

**date-fns** + **date-fns-tz** kullanıyoruz çünkü:

- ✅ Tree-shakeable (sadece kullandığınız import edilir)
- ✅ TypeScript native
- ✅ Immutable (orijinal date değişmez)
- ✅ Functional programming approach
- ✅ Hafif (Luxon'dan %60 daha küçük)
- ✅ React Native ile sorunsuz

## 🎯 Kullanım

### 1. Basic Formatting

```typescript
import {dateUtils, DATE_FORMATS} from '@shared/utils/date';

const now = new Date();

// Different formats
dateUtils.format(now, DATE_FORMATS.FULL);        // Friday, January 1, 2024
dateUtils.format(now, DATE_FORMATS.LONG);        // January 1, 2024
dateUtils.format(now, DATE_FORMATS.MEDIUM);      // Jan 1, 2024
dateUtils.format(now, DATE_FORMATS.SHORT);       // 01/01/2024

// With time
dateUtils.formatDateTime(now);                   // Jan 1, 2024, 12:00 PM
dateUtils.formatTime(now);                       // 12:00 PM
dateUtils.formatTime(now, 'en', true);          // 13:00 (24-hour)

// Short format
dateUtils.formatDateShort(now);                  // Jan 1, 2024
```

### 2. Relative Time (e.g., "2 hours ago")

```typescript
import {dateUtils} from '@shared/utils/date';

const yesterday = new Date('2024-01-01T12:00:00Z');
const nextWeek = new Date('2024-01-08T12:00:00Z');

// Relative to now
dateUtils.formatRelativeTime(yesterday);  // "yesterday"
dateUtils.formatRelativeTime(nextWeek);   // "in 7 days"

// Between two dates
dateUtils.formatTimeBetween(yesterday, now);  // "1 day"

// Calendar relative
dateUtils.formatCalendarRelative(yesterday);  // "yesterday at 12:00 PM"
```

### 3. With React Hook (Auto Locale)

```typescript
import {useDateFormatter} from '@shared/hooks';

function MyComponent() {
  const {format, formatRelative, formatWithTime} = useDateFormatter();
  const createdAt = '2024-01-15T14:30:00Z';
  
  return (
    <View>
      <Text>{formatRelative(createdAt)}</Text>        {/* "2 hours ago" */}
      <Text>{format(createdAt)}</Text>                {/* "Jan 15, 2024" */}
      <Text>{formatWithTime(createdAt)}</Text>        {/* "Jan 15, 2024, 2:30 PM" */}
    </View>
  );
}
```

Hook otomatik olarak kullanıcının dil tercihini kullanır!

### 4. API Date Parsing

```typescript
import {dateUtils} from '@shared/utils/date';

// Backend'den gelen ISO string
const apiDate = '2024-01-15T14:30:00.000Z';

// Parse ve format
dateUtils.format(apiDate, DATE_FORMATS.LONG_WITH_TIME);
// "January 15, 2024, 2:30 PM"

// Relative
dateUtils.formatRelativeTime(apiDate);
// "2 hours ago"

// Check if valid
if (dateUtils.isValid(apiDate)) {
  // Use it
}
```

### 5. Date Comparison

```typescript
import {dateUtils} from '@shared/utils/date';

const date = new Date('2024-01-15');

// Check date properties
dateUtils.compare.isToday(date);       // false
dateUtils.compare.isYesterday(date);   // false
dateUtils.compare.isTomorrow(date);    // false
dateUtils.compare.isThisWeek(date);    // true/false
dateUtils.compare.isThisMonth(date);   // true/false
dateUtils.compare.isThisYear(date);    // true

dateUtils.compare.isFuture(date);      // true/false
dateUtils.compare.isPast(date);        // true/false

// Compare two dates
const date1 = new Date('2024-01-15');
const date2 = new Date('2024-01-20');

dateUtils.compare.isBefore(date1, date2);  // true
dateUtils.compare.isAfter(date1, date2);   // false
dateUtils.compare.isEqual(date1, date2);   // false
```

### 6. Date Manipulation

```typescript
import {dateUtils} from '@shared/utils/date';

const now = new Date();

// Add time
dateUtils.manipulate.addDays(now, 7);      // +7 days
dateUtils.manipulate.addWeeks(now, 2);     // +2 weeks
dateUtils.manipulate.addMonths(now, 3);    // +3 months
dateUtils.manipulate.addYears(now, 1);     // +1 year

// Subtract time
dateUtils.manipulate.subDays(now, 7);      // -7 days
dateUtils.manipulate.subMonths(now, 3);    // -3 months

// Start/End of periods
dateUtils.manipulate.startOfDay(now);      // 00:00:00
dateUtils.manipulate.endOfDay(now);        // 23:59:59
dateUtils.manipulate.startOfWeek(now);     // Monday 00:00
dateUtils.manipulate.endOfWeek(now);       // Sunday 23:59
dateUtils.manipulate.startOfMonth(now);    // 1st of month
dateUtils.manipulate.endOfMonth(now);      // Last day of month
dateUtils.manipulate.startOfYear(now);     // Jan 1
dateUtils.manipulate.endOfYear(now);       // Dec 31
```

### 7. Calculate Differences

```typescript
import {dateUtils} from '@shared/utils/date';

const date1 = new Date('2024-01-01');
const date2 = new Date('2024-01-15');

// Different units
dateUtils.difference.inDays(date2, date1);        // 14
dateUtils.difference.inCalendarDays(date2, date1); // 14
dateUtils.difference.inHours(date2, date1);       // 336
dateUtils.difference.inMinutes(date2, date1);     // 20160
dateUtils.difference.inSeconds(date2, date1);     // 1209600
```

### 8. Timezone Support

```typescript
import {dateUtils} from '@shared/utils/date';

const now = new Date();

// Format in different timezones
dateUtils.timezone.format(now, 'UTC', DATE_FORMATS.LONG_WITH_TIME);
// "January 15, 2024, 2:30 PM"

dateUtils.timezone.format(now, 'America/New_York', DATE_FORMATS.LONG_WITH_TIME);
// "January 15, 2024, 9:30 AM"

dateUtils.timezone.format(now, 'Asia/Tokyo', DATE_FORMATS.LONG_WITH_TIME);
// "January 15, 2024, 11:30 PM"

// Convert to timezone
const nyTime = dateUtils.timezone.toZone(now, 'America/New_York');

// Convert from timezone
const utcTime = dateUtils.timezone.fromZone(nyTime, 'America/New_York');
```

## 📋 Format Presets

```typescript
export const DATE_FORMATS = {
  // Full
  FULL: 'PPPP',              // Friday, January 1, 2024
  FULL_WITH_TIME: 'PPPPp',   // Friday, January 1, 2024 at 12:00 PM

  // Long
  LONG: 'PPP',               // January 1, 2024
  LONG_WITH_TIME: 'PPPp',    // January 1, 2024, 12:00 PM

  // Medium
  MEDIUM: 'PP',              // Jan 1, 2024
  MEDIUM_WITH_TIME: 'PPp',   // Jan 1, 2024, 12:00 PM

  // Short
  SHORT: 'P',                // 01/01/2024
  SHORT_WITH_TIME: 'Pp',     // 01/01/2024, 12:00 PM

  // Time only
  TIME: 'p',                 // 12:00 PM
  TIME_24H: 'HH:mm',         // 13:00

  // Custom
  YEAR_MONTH: 'yyyy-MM',     // 2024-01
  MONTH_DAY: 'MMM d',        // Jan 1
  DAY_MONTH: 'd MMM',        // 1 Jan
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", // ISO 8601
};
```

### Custom Format

```typescript
import {dateUtils} from '@shared/utils/date';

// Use date-fns format tokens
dateUtils.format(new Date(), 'dd/MM/yyyy');       // 15/01/2024
dateUtils.format(new Date(), 'MMMM do, yyyy');    // January 15th, 2024
dateUtils.format(new Date(), 'EEEE, HH:mm');      // Friday, 14:30
dateUtils.format(new Date(), 'yyyy-MM-dd');       // 2024-01-15

// See: https://date-fns.org/docs/format
```

## 🌍 Locale Support

Otomatik olarak kullanıcının dil tercihini kullanır (en/tr):

```typescript
// Hook ile (önerilen)
const {format} = useDateFormatter();
format(now); // Otomatik locale

// Manuel locale
dateUtils.format(now, DATE_FORMATS.LONG, 'tr'); // Türkçe
dateUtils.format(now, DATE_FORMATS.LONG, 'en'); // English
```

**Örnekler:**

```typescript
// English
"January 15, 2024"
"2 hours ago"
"yesterday at 5:30 PM"

// Türkçe
"15 Ocak 2024"
"2 saat önce"
"dün 17:30"
```

## 💡 Best Practices

### 1. ✅ API Tarihleri her zaman ISO 8601 kullan

```typescript
// ✅ Good (ISO 8601)
const createdAt = '2024-01-15T14:30:00.000Z';

// ❌ Bad (ambiguous)
const createdAt = '01/15/2024';
```

### 2. ✅ Hook kullan (auto locale)

```typescript
// ✅ Good - Hook kullan
function MyComponent() {
  const {format, formatRelative} = useDateFormatter();
  return <Text>{formatRelative(date)}</Text>;
}

// ❌ Okay but not ideal - Manuel locale
function MyComponent() {
  const language = useUIStore(state => state.language);
  return <Text>{dateUtils.formatRelativeTime(date, language)}</Text>;
}
```

### 3. ✅ Preset formats kullan

```typescript
// ✅ Good - Preset kullan
dateUtils.format(date, DATE_FORMATS.LONG_WITH_TIME);

// ❌ Okay but less maintainable
dateUtils.format(date, 'PPPp');
```

### 4. ✅ Validation yap

```typescript
// ✅ Good
if (dateUtils.isValid(userInput)) {
  const formatted = dateUtils.format(userInput);
} else {
  showError('Invalid date');
}

// ❌ Bad
const formatted = dateUtils.format(userInput); // Might crash
```

### 5. ✅ Immutable operations

```typescript
// ✅ Good - date-fns is immutable
const tomorrow = dateUtils.manipulate.addDays(today, 1);
// `today` is unchanged!

// ❌ Bad (if using native Date)
today.setDate(today.getDate() + 1);
// `today` is mutated!
```

## 🎨 UI Examples

### Message Timestamp

```typescript
function MessageItem({message}) {
  const {formatRelative} = useDateFormatter();
  
  return (
    <View>
      <Text>{message.text}</Text>
      <Text style={styles.timestamp}>
        {formatRelative(message.createdAt)}
      </Text>
    </View>
  );
}
// "2 hours ago"
// "yesterday"
// "last week"
```

### Event Card

```typescript
function EventCard({event}) {
  const {format, formatTimeOnly} = useDateFormatter();
  
  return (
    <View>
      <Text>{format(event.date, DATE_FORMATS.LONG)}</Text>
      <Text>{formatTimeOnly(event.startTime)} - {formatTimeOnly(event.endTime)}</Text>
    </View>
  );
}
// "January 15, 2024"
// "2:00 PM - 5:00 PM"
```

### Countdown Timer

```typescript
function CountdownTimer({targetDate}) {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = dateUtils.difference.inSeconds(targetDate, now);
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate]);
  
  return <Text>{timeLeft}</Text>;
}
```

### Date Range Picker Value

```typescript
function DateRangeSummary({startDate, endDate}) {
  const {format} = useDateFormatter();
  const days = dateUtils.difference.inCalendarDays(endDate, startDate);
  
  return (
    <View>
      <Text>
        {format(startDate, DATE_FORMATS.MEDIUM)} - {format(endDate, DATE_FORMATS.MEDIUM)}
      </Text>
      <Text>({days} days)</Text>
    </View>
  );
}
// "Jan 15, 2024 - Jan 20, 2024"
// "(5 days)"
```

## 🔧 TypeScript Support

Tam tip güvenli:

```typescript
// All functions are properly typed
const date: Date = new Date();
const formatted: string = dateUtils.format(date);
const days: number = dateUtils.difference.inDays(date1, date2);
const isValid: boolean = dateUtils.isValid(date);
```

## 📚 Örnekler

Detaylı kullanım örneği:
- `src/shared/utils/date.example.tsx`

## 🔗 Referanslar

- [date-fns Documentation](https://date-fns.org/)
- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)
- [Format Tokens](https://date-fns.org/docs/format)

---

**Özet:** Modern, tip güvenli, locale-aware date utilities! 📅
