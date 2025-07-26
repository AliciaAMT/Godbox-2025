# Holiday Readings Implementation

## Overview

This document details the implementation of the holiday readings system, specifically focusing on Rosh Chodesh (New Moon) detection and traditional scripture readings.

## Architecture

### Components

#### 1. HolidayModalComponent
**Location**: `src/app/components/holiday-modal/`

**Purpose**: Displays detailed holiday information and Bible readings in a modal dialog

**Key Features**:
- Fetches Bible passages using ESVApiService
- Displays holiday descriptions, significance, and customs
- Handles Rosh Chodesh specific information
- Responsive design with proper accessibility

**Interfaces**:
```typescript
interface HolidayInfo {
  name: string;
  description: string;
  significance: string;
  customs: string;
  readings: string[];
}

interface HolidayReading {
  reference: string;
  text: string;
  translation: string;
}
```

#### 2. DateComponent Enhancements
**Location**: `src/app/components/date/date.component.ts`

**New Features**:
- `isModalOpen: boolean` - Controls modal visibility
- `onHolidayClick()` - Opens holiday modal
- `onCloseModal()` - Closes holiday modal
- `getHebrewMonthName()` - Maps Hebrew month numbers to names

**Holiday Detection Logic**:
```typescript
getCurrentEvents(hDate: HDate) {
  // Prioritizes Rosh Chodesh events
  // Formats currentHoliday as "Rosh Chodesh [Month Name]"
}
```

### Services

#### 1. ReadingsService
**Location**: `src/app/services/readings.service.ts`

**Rosh Chodesh Logic**:
- Detects Rosh Chodesh using Hebrew calendar
- Preserves regular Torah readings while marking as holiday
- Logs detection for debugging

**Key Method**:
```typescript
isRoshChodesh(date: Date): boolean {
  const hDate = new HDate(date);
  const events = HebrewCalendar.getHolidaysForDate(hDate);
  return events.some(event => event.basename === 'Rosh Chodesh');
}
```

#### 2. ESVApiService
**Location**: `src/app/services/esv-api.service.ts`

**Usage**: Fetches Bible passages for holiday readings

## Implementation Details

### Rosh Chodesh Detection

1. **Automatic Detection**: System checks if current date is Rosh Chodesh using `@hebcal/core`
2. **Reading Assignment**: Based on day of week:
   - **Sabbath**: Isaiah 66:1-24
   - **Other Days**: Psalm 104:19, Colossians 2:16
3. **Display Logic**: Shows in separate "Holiday:" section alongside regular readings

### Holiday Modal System

1. **Trigger**: Click on holiday display in date component
2. **Content**: Fetches holiday information and Bible readings
3. **Navigation**: Uses existing modal infrastructure for consistency

### Bible API Integration

1. **ESV API**: Primary source for Bible passages
2. **Fallback**: Graceful handling of API failures
3. **Caching**: Consider implementing caching for performance

## Database Structure

### Holiday Information Database
```typescript
holidayDatabase = {
  'Rosh Chodesh': {
    name: 'Rosh Chodesh',
    description: 'The first day of the Hebrew month...',
    significance: 'Marks the new moon and beginning of month...',
    customs: 'Special prayers and readings...',
    readings: ['Numbers 28:1-15', 'Isaiah 66:1-24']
  }
  // Additional holidays to be added
}
```

## Future Enhancements

### 1. Additional Holidays
**Priority**: High

**Holidays to Implement**:
- Pesach (Passover)
- Shavuot (Pentecost)
- Rosh Hashanah (New Year)
- Yom Kippur (Day of Atonement)
- Sukkot (Feast of Tabernacles)
- Hanukkah
- Purim

**Implementation Strategy**:
```typescript
// Example structure for additional holidays
holidayDatabase = {
  'Pesach': {
    name: 'Pesach',
    description: 'Commemorates the Exodus from Egypt...',
    readings: ['Exodus 12:1-51', 'Leviticus 23:4-8']
  },
  'Shavuot': {
    name: 'Shavuot',
    description: 'Commemorates the giving of the Torah...',
    readings: ['Exodus 19:1-20:23', 'Ruth 1:1-4:22']
  }
  // ... additional holidays
}
```

### 2. Seasonal Readings
**Priority**: Medium

**Implementation**:
- Different readings for different seasons
- Special readings for High Holy Days
- Seasonal themes and messages

### 3. Reading Accuracy Verification
**Priority**: High

**Tasks**:
- Verify traditional readings with authoritative sources
- Consult with Jewish scholars or resources
- Cross-reference multiple sources for accuracy

### 4. Performance Optimization
**Priority**: Medium

**Considerations**:
- Implement caching for Bible API calls
- Pre-load holiday information
- Optimize modal loading times

## Testing Strategy

### Unit Tests
- Holiday detection logic
- Bible API integration
- Modal component functionality

### Integration Tests
- End-to-end holiday reading flow
- Modal opening/closing
- Bible passage display

### Manual Testing
- Test on actual Rosh Chodesh dates
- Verify readings match traditional sources
- Test on different devices and screen sizes

## Security Considerations

### API Rate Limiting
- Monitor ESV API usage
- Implement proper error handling
- Consider API key rotation

### Data Validation
- Validate holiday information
- Sanitize Bible passage content
- Handle malformed data gracefully

## Deployment Notes

### Environment Variables
- Ensure ESV API key is properly configured
- Test API connectivity in production

### Monitoring
- Monitor API call success rates
- Track modal usage statistics
- Monitor performance metrics

## Maintenance

### Regular Tasks
- Update holiday database as needed
- Verify reading accuracy annually
- Monitor API usage and costs
- Update Hebrew calendar dependencies

### Documentation Updates
- Keep this document updated with new features
- Document any changes to holiday logic
- Update testing procedures

---

*This document should be updated as the holiday readings system evolves and additional holidays are implemented.* 
