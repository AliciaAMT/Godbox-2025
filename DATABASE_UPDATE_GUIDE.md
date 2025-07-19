# Database Update Guide

## Overview

This guide explains how to update the `kriyah.ts` database file with the new haftarah readings and complete Sabbath readings using the services we've created.

## What Gets Updated

The database update will:

1. **Add haftarah readings** for all parashot (currently most are empty)
2. **Fill in missing Torah readings** for days that currently have empty readings
3. **Generate complete weekly cycles** for each parashah
4. **Update the kriyah.ts file** with the new data

## Current State vs Updated State

### Current State (kriyah.ts)
```typescript
// Most entries have empty haftarah fields
7: {
  idNo: 7,
  parashat: "Vayigash",
  // ... other fields
  haftarah: "", // ❌ Empty
  // ... other fields
}
```

### Updated State (After Update)
```typescript
// All entries will have proper haftarah readings
7: {
  idNo: 7,
  parashat: "Vayigash",
  // ... other fields
  haftarah: "Ezekiel 37:15-28", // ✅ Proper haftarah
  // ... other fields
}
```

## How to Update the Database

### Option 1: Using the UI Component

1. **Navigate to the database updater**:
   ```
   http://localhost:4200/database-updater
   ```

2. **Click "Update Database"** button

3. **Wait for completion** - the component will show progress and results

### Option 2: Using the Utility Script

1. **Run the example script**:
   ```bash
   node update-database-example.js
   ```

2. **This will generate** a sample updated database file

### Option 3: Using the Angular Service

1. **Import the update utility**:
   ```typescript
   import { updateKriyahDatabase } from './utils/update-kriyah-database';
   ```

2. **Call the update function**:
   ```typescript
   await updateKriyahDatabase();
   ```

## What the Update Does

### 1. Generates Complete Readings
- **Daily Torah readings** for all 7 days of each parashah
- **Haftarah readings** for Shabbat (day 7)
- **Proper Hebrew dates** and translations

### 2. Uses the New Services
- **HaftarahService**: Provides haftarah mappings for all parashot
- **ScriptureMappingService**: Provides daily Torah readings
- **ParashahService**: Provides parashah translations and metadata

### 3. Updates the Database File
- **Replaces** the existing `kriyah.ts` file
- **Maintains** the same data structure
- **Adds** all missing readings and haftarah

## Sample Output

After the update, entries will look like this:

```typescript
export const KRIYAH: any = {
  1: {
    idNo: 1,
    parashat: "Bereshit",
    parashatHeb: "בראשית",
    parashatEng: "In the Beginning",
    date: "2025-01-01",
    holiday: "Parashat Bereshit",
    holidayReadings: "",
    holidayDate: "1 Tevet 5785",
    kriyah: 1,
    kriyahHeb: "קריאה א",
    kriyahEng: "Reading 1",
    kriyahDate: "1 Tevet 5785",
    torah: "Genesis 1:1-5",
    prophets: "",
    writings: "",
    britChadashah: "",
    haftarah: "", // Empty for non-Shabbat days
    apostles: ""
  },
  7: {
    idNo: 7,
    parashat: "Bereshit",
    parashatHeb: "בראשית",
    parashatEng: "In the Beginning",
    date: "2025-01-07",
    holiday: "Parashat Bereshit",
    holidayReadings: "",
    holidayDate: "7 Tevet 5785",
    kriyah: 7,
    kriyahHeb: "קריאה ז",
    kriyahEng: "Reading 7",
    kriyahDate: "7 Tevet 5785",
    torah: "Genesis 2:1-3",
    prophets: "",
    writings: "",
    britChadashah: "",
    haftarah: "Isaiah 42:5-21", // ✅ Haftarah for Shabbat
    apostles: ""
  }
}
```

## Haftarah Mappings Included

The update includes haftarah readings for all parashot:

### Genesis (Bereshit)
- Bereshit: Isaiah 42:5-21
- Noach: Isaiah 54:9-10
- Lech Lecha: Isaiah 40:27-41
- Vayera: 2 Kings 4:1-37
- Chayei Sarah: 1 Kings 1:1-31
- Toldot: Malachi 1:1-14
- Vayetze: Hosea 12:12-14
- Vayishlach: Obadiah 1:1-21
- Vayeshev: Amos 2:6-3:8
- Miketz: 1 Kings 3:15-28
- Vayigash: Ezekiel 37:15-28
- Vayechi: 1 Kings 2:1-12

### And all other parashot...
(See the complete list in `SABBATH_READINGS_DOCUMENTATION.md`)

## Benefits After Update

1. **Complete Sabbath Readings**: Every Shabbat will have proper haftarah
2. **No More Empty Fields**: All Torah readings will be filled
3. **Accurate References**: All references formatted for bible API
4. **Hebrew Calendar Integration**: Proper Hebrew dates and translations
5. **Consistent Data**: All readings follow the same structure

## Testing the Update

### 1. Test the Services
Navigate to `/sabbath-test` to test the new services:
- Load today's readings
- Test haftarah service
- View complete Sabbath readings

### 2. Test the Database Updater
Navigate to `/database-updater` to test the update process:
- Click "Update Database"
- View results and sample data

### 3. Verify the Updated File
Check `src/app/database/kriyah.ts` after update:
- All haftarah fields should be filled
- All Torah readings should be present
- Proper Hebrew dates and translations

## Troubleshooting

### Common Issues

1. **Empty haftarah fields**: Make sure the HaftarahService is properly imported
2. **Missing Torah readings**: Check that ScriptureMappingService has complete mappings
3. **Date issues**: Verify hebCal integration is working properly

### Debug Steps

1. **Check console logs** for any errors
2. **Verify service dependencies** are properly injected
3. **Test individual services** before running full update
4. **Backup the original file** before updating

## Next Steps

After updating the database:

1. **Test the application** to ensure everything works
2. **Verify readings** are displaying correctly
3. **Check haftarah readings** are showing on Shabbat
4. **Update any components** that depend on the database

## Files Created/Modified

### New Files
- `src/app/services/haftarah.service.ts` - Haftarah service
- `src/app/services/sabbath-readings.service.ts` - Sabbath readings service
- `src/app/utils/update-kriyah-database.ts` - Database update utility
- `src/app/components/sabbath-readings-test/` - Test component
- `src/app/components/database-updater/` - Database updater component

### Modified Files
- `src/app/services/parashah.service.ts` - Updated with haftarah integration
- `src/app/app.routes.ts` - Added new routes
- `src/app/database/kriyah.ts` - Will be updated with new data

### Documentation
- `SABBATH_READINGS_DOCUMENTATION.md` - Complete service documentation
- `DATABASE_UPDATE_GUIDE.md` - This guide
- `update-database-example.js` - Example script

## Summary

The database update process will transform your current `kriyah.ts` file from having mostly empty haftarah fields to having complete readings for every parashah, including proper haftarah readings for Shabbat. This addresses the original issue where Sabbath readings were empty due to how hebCal handles parashot. 
