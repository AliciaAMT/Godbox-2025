# Automated Readings Database Generator

This solution automates the creation of the Torah readings database using the hebCal library, eliminating the need for manual entry of parashot (weekly Torah portions).

## Overview

The old system required manually creating entries like this for each day:

```typescript
{
  idNo: 1,
  parashat: 'Bereshit',
  parashatHeb: 'בראשית',
  parashatEng: 'In the Beginning',
  date: '2023-10-08',
  holiday: 'Simchat Torah',
  holidayReadings: 'Deuteronomy 33:1-34:12, Revelation 22',
  holidayDate: '23 Tishrei 5784',
  kriyah: 1,
  kriyahHeb: 'קריאה א',
  kriyahEng: 'Reading 1',
  kriyahDate: '23 Tishrei 5783',
  torah: 'Genesis 1',
  prophets: 'Joshua 1',
  writings: 'Psalm 1',
  britChadashah: 'Matthew 1',
}
```

The new automated system generates this data automatically using hebCal, with only the parashah-related fields populated automatically.

## Files Created

### 1. `src/app/services/parashah.service.ts`
The main service that handles automated generation of readings data.

**Key Features:**
- Uses hebCal to get parashot for any date range
- Automatically translates parashah names to Hebrew and English
- Generates Hebrew dates and kriyah numbers
- Creates TypeScript code output
- Handles holiday detection

### 2. `src/app/utils/generate-readings.ts`
Utility functions for generating readings database.

**Functions:**
- `generateReadingsDatabase()` - Generate for 2024
- `generateReadingsForRange(startYear, endYear)` - Generate for custom range
- `generateCurrentYearReadings()` - Generate for current year

### 3. `src/app/components/parashah-generator/`
A test component to demonstrate the service in action.

## How to Use

### Method 1: Using the Service Directly

```typescript
import { ParashahService } from './services/parashah.service';

const parashahService = new ParashahService();

// Generate readings for 2024
const startDate = new Date('2024-01-01');
const endDate = new Date('2024-12-31');
const readings = parashahService.generateReadings(startDate, endDate);

// Generate TypeScript code
const tsCode = parashahService.generateTypeScriptCode(readings);
console.log(tsCode);
```

### Method 2: Using the Utility Functions

```typescript
import { generateReadingsForRange } from './utils/generate-readings';

// Generate for 2024-2025
const readings = generateReadingsForRange(2024, 2025);
```

### Method 3: Using the Test Component

1. Add the component to your app module
2. Navigate to the component in your app
3. Use the UI to generate readings and download the TypeScript code

## What Gets Automated

### ✅ Automatically Generated (via hebCal):
- `parashat` - English parashah name
- `parashatHeb` - Hebrew parashah name  
- `parashatEng` - English translation
- `date` - Gregorian date
- `holiday` - Jewish holidays
- `holidayDate` - Hebrew date
- `kriyah` - Reading number (1-7)
- `kriyahHeb` - Hebrew reading number
- `kriyahEng` - English reading number
- `kriyahDate` - Hebrew date

### ❌ Still Need Manual Entry (or separate automation):
- `torah` - Specific Torah readings
- `prophets` - Prophets readings
- `writings` - Writings readings
- `britChadashah` - New Testament readings
- `haftarah` - Haftarah readings
- `apostles` - Apostles readings
- `holidayReadings` - Holiday-specific readings

## Parashah Translations

The service includes a comprehensive mapping of all 54 parashot with their Hebrew names and English translations:

```typescript
private readonly parashahTranslations = {
  'Bereshit': { heb: 'בראשית', eng: 'In the Beginning' },
  'Noach': { heb: 'נח', eng: 'Noah' },
  // ... all 54 parashot
};
```

## Output Format

The generated TypeScript code follows the exact same format as your original database:

```typescript
export const KRIYAH: any = {
  1: {
    idNo: 1,
    parashat: 'Bereshit',
    parashatHeb: 'בראשית',
    parashatEng: 'In the Beginning',
    date: '2024-01-01',
    holiday: '',
    holidayReadings: '',
    holidayDate: '19 Tevet 5784',
    kriyah: 1,
    kriyahHeb: 'קריאה א',
    kriyahEng: 'Reading 1',
    kriyahDate: '19 Tevet 5784',
    torah: '', // Manual entry needed
    prophets: '', // Manual entry needed
    writings: '', // Manual entry needed
    britChadashah: '', // Manual entry needed
    haftarah: '', // Manual entry needed
    apostles: '', // Manual entry needed
  },
  // ... more entries
};
```

## Benefits

1. **Time Savings**: No more manual entry of dates, parashot, and Hebrew dates
2. **Accuracy**: hebCal ensures correct parashah assignments and Hebrew dates
3. **Maintainability**: Easy to generate new years or date ranges
4. **Consistency**: Standardized format and naming
5. **Extensibility**: Easy to add more automated fields in the future

## Future Enhancements

1. **Torah Readings Database**: Create a separate database of Torah readings by parashah and day
2. **Prophets/Writings Automation**: Similar database for prophets and writings readings
3. **Holiday Readings**: Database of holiday-specific readings
4. **API Integration**: Connect to external APIs for complete readings data
5. **Web Interface**: Full web interface for managing and generating readings

## Installation

The solution uses the already installed `@hebcal/core` package. No additional dependencies are required.

## Usage Example

```typescript
// Generate readings for 2024
const service = new ParashahService();
const readings = service.generateReadings(
  new Date('2024-01-01'), 
  new Date('2024-12-31')
);

// Save to file
const tsCode = service.generateTypeScriptCode(readings);
// Copy tsCode to your kriyah.ts file
```

This automated solution significantly reduces the manual work required to maintain your readings database while ensuring accuracy and consistency. 
