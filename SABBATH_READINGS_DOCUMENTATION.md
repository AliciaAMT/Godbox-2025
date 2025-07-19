# Sabbath Readings and Haftarah Services

## Overview

This document describes the new services created to handle Sabbath readings and haftarah (prophetic readings) for the Torah portions. The system addresses the issue where Sabbath readings were empty due to how hebCal handles parashot, and provides complete weekly readings plus haftarah for each Sabbath.

## Services Created

### 1. HaftarahService (`src/app/services/haftarah.service.ts`)

**Purpose**: Provides comprehensive haftarah (prophetic) readings for each Torah portion.

**Key Features**:
- Complete haftarah mappings for all 54 parashot
- Support for all books of the Prophets (Nevi'im)
- Formatted references for api.bible integration
- Hebrew and English descriptions

**Main Methods**:
- `getHaftarah(parashah: string)`: Get haftarah reading object
- `getHaftarahReference(parashah: string)`: Get formatted reference string
- `getAvailableParashot()`: Get all parashot with haftarah
- `hasHaftarah(parashah: string)`: Check if parashah has haftarah

**Example Usage**:
```typescript
const haftarahService = new HaftarahService();
const haftarah = haftarahService.getHaftarahReference('Bereshit');
// Returns: "Isaiah 42:5-21"
```

### 2. SabbathReadingsService (`src/app/services/sabbath-readings.service.ts`)

**Purpose**: Gathers complete Sabbath readings including the entire week's Torah readings plus haftarah.

**Key Features**:
- Complete weekly readings (Sunday through Saturday)
- Sabbath-specific haftarah readings
- Combined Torah readings for complete Sabbath experience
- Hebrew calendar integration via hebCal

**Main Methods**:
- `getSabbathReadings(startDate, endDate)`: Get Sabbath readings for date range
- `getSabbathReadingsForToday()`: Get current Sabbath readings
- `getNextSabbathReading()`: Get next Sabbath reading
- `getSabbathReadingForParashah(parashah)`: Get specific parashah reading

**Data Structure**:
```typescript
interface SabbathReading {
  idNo: number;
  parashat: string;
  parashatHeb: string;
  parashatEng: string;
  sabbathDate: string;
  hebrewDate: string;
  weekReadings: DailyReading[];
  haftarah: string;
  haftarahReference: string;
  completeTorahReading: string;
}
```

### 3. Updated ParashahService

**Integration**: The existing ParashahService has been updated to integrate with the HaftarahService.

**Changes**:
- Added HaftarahService dependency injection
- Updated `createReading()` method to use haftarah service
- Proper haftarah assignment for Shabbat (kriyah 7)

## Haftarah Mappings

The HaftarahService includes comprehensive mappings for all parashot:

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

### Exodus (Shemot)
- Shemot: Isaiah 27:6-28:13
- Vaera: Ezekiel 28:25-29:21
- Bo: Jeremiah 46:13-28
- Beshalach: Judges 4:4-5:31
- Yitro: Isaiah 6:1-13
- Mishpatim: Jeremiah 34:8-22
- Terumah: 1 Kings 5:26-6:13
- Tetzaveh: Ezekiel 43:10-27
- Ki Tisa: 1 Kings 18:1-39
- Vayakhel: 1 Kings 7:40-50
- Pekudei: 1 Kings 7:51-8:21

### Leviticus (Vayikra)
- Vayikra: Isaiah 43:21-44:23
- Tzav: Jeremiah 7:21-34
- Shmini: 2 Samuel 6:1-19
- Tazria: 2 Kings 4:42-5:19
- Metzora: 2 Kings 7:3-20
- Achrei Mot: Ezekiel 22:1-19
- Kedoshim: Amos 9:7-15
- Emor: Ezekiel 44:15-31
- Behar: Jeremiah 32:6-27
- Bechukotai: Jeremiah 16:19-17:14

### Numbers (Bamidbar)
- Bamidbar: Hosea 2:1-22
- Nasso: Judges 13:2-25
- Beha'alotcha: Zechariah 2:14-4:7
- Sh'lach: Joshua 2:1-24
- Korach: 1 Samuel 11:14-12:22
- Chukat: Judges 11:1-33
- Balak: Micah 5:6-8
- Pinchas: 1 Kings 18:46-19:21
- Matot: Jeremiah 1:1-2:3
- Masei: Jeremiah 2:4-28

### Deuteronomy (Devarim)
- Devarim: Isaiah 1:1-27
- Vaetchanan: Isaiah 40:1-26
- Eikev: Isaiah 49:14-51:3
- Re'eh: Isaiah 54:11-55:5
- Shoftim: Isaiah 51:12-52:12
- Ki Teitzei: Isaiah 54:1-10
- Ki Tavo: Isaiah 60:1-22
- Nitzavim: Isaiah 61:10-63:9
- Vayeilech: Hosea 14:1-10
- Ha'Azinu: 2 Samuel 22:1-51
- Vezot Haberachah: Joshua 1:1-18

## Testing

### Test Component
A test component has been created at `src/app/components/sabbath-readings-test/sabbath-readings-test.component.ts` to demonstrate the functionality.

**Access**: Navigate to `/sabbath-test` in the application.

**Features**:
- Load today's Sabbath readings
- Load next Sabbath reading
- Test haftarah service
- Display complete weekly readings with haftarah

### Test Script
A utility script is available at `src/app/utils/test-sabbath-readings.ts` for testing the services programmatically.

## Integration

### With Existing Services
The new services integrate seamlessly with existing services:
- **ParashahService**: Now includes haftarah readings
- **ScriptureMappingService**: Provides daily Torah readings
- **hebCal**: Provides Hebrew calendar and parashah dates

### API Integration
All references are formatted for api.bible integration:
- Torah readings: "Genesis 1:1-5"
- Haftarah readings: "Isaiah 42:5-21"
- Combined readings: "Genesis 1:1-5; Genesis 1:6-8; ..."

## Usage Examples

### Get Sabbath Readings for Today
```typescript
const sabbathService = new SabbathReadingsService();
const todayReadings = sabbathService.getSabbathReadingsForToday();
```

### Get Haftarah for Specific Parashah
```typescript
const haftarahService = new HaftarahService();
const haftarah = haftarahService.getHaftarahReference('Bereshit');
```

### Generate Complete Sabbath Reading
```typescript
const sabbathReading = sabbathService.getSabbathReadingsForDate(new Date());
// Returns complete week's readings + haftarah
```

## Benefits

1. **Complete Sabbath Experience**: Provides entire week's readings plus haftarah
2. **Accurate Haftarah**: Comprehensive mappings for all parashot
3. **API Ready**: Formatted references for bible API integration
4. **Hebrew Calendar Integration**: Uses hebCal for accurate dates
5. **Extensible**: Easy to add new parashot or modify readings

## Future Enhancements

1. **Special Haftarah**: Add support for special haftarah readings (holidays, etc.)
2. **Multiple Traditions**: Support for different haftarah traditions
3. **Brit Chadashah**: Add New Testament readings for Messianic communities
4. **Audio Integration**: Support for audio readings
5. **Translation Support**: Multiple language support for haftarah readings 
