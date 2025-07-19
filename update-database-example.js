/**
 * Example script to update the kriyah.ts database with new haftarah readings
 * This script demonstrates how to run the database update outside of Angular
 */

const fs = require('fs');
const path = require('path');

// Mock the services for demonstration
class MockHaftarahService {
  getHaftarahReference(parashah) {
    const haftarahMappings = {
      'Bereshit': 'Isaiah 42:5-21',
      'Noach': 'Isaiah 54:9-10',
      'Lech Lecha': 'Isaiah 40:27-41',
      'Vayera': '2 Kings 4:1-37',
      'Chayei Sarah': '1 Kings 1:1-31',
      'Toldot': 'Malachi 1:1-14',
      'Vayetze': 'Hosea 12:12-14',
      'Vayishlach': 'Obadiah 1:1-21',
      'Vayeshev': 'Amos 2:6-3:8',
      'Miketz': '1 Kings 3:15-28',
      'Vayigash': 'Ezekiel 37:15-28',
      'Vayechi': '1 Kings 2:1-12'
    };
    return haftarahMappings[parashah] || '';
  }
}

class MockScriptureMappingService {
  getScriptureReferences(parashah, kriyah) {
    // Mock scripture mappings
    const mappings = {
      'Bereshit': [
        { torah: { reference: 'Genesis 1:1-5' } },
        { torah: { reference: 'Genesis 1:6-8' } },
        { torah: { reference: 'Genesis 1:9-13' } },
        { torah: { reference: 'Genesis 1:14-19' } },
        { torah: { reference: 'Genesis 1:20-23' } },
        { torah: { reference: 'Genesis 1:24-31' } },
        { torah: { reference: 'Genesis 2:1-3' } }
      ],
      'Noach': [
        { torah: { reference: 'Genesis 6:9-22' } },
        { torah: { reference: 'Genesis 7:1-16' } },
        { torah: { reference: 'Genesis 7:17-23' } },
        { torah: { reference: 'Genesis 7:24-8:4' } },
        { torah: { reference: 'Genesis 8:5-14' } },
        { torah: { reference: 'Genesis 8:15-22' } },
        { torah: { reference: 'Genesis 9:1-7' } }
      ]
    };

    const readings = mappings[parashah];
    return readings ? readings[kriyah - 1] : null;
  }
}

/**
 * Generate updated kriyah data with haftarah readings
 */
function generateUpdatedKriyahData() {
  const haftarahService = new MockHaftarahService();
  const scriptureService = new MockScriptureMappingService();

  const updatedKriyah = {};
  let idNo = 1;

  // Sample parashot for demonstration
  const sampleParashot = ['Bereshit', 'Noach'];
  const startDate = new Date('2025-01-01');

  sampleParashot.forEach((parashah, parashahIndex) => {
    const parashahStartDate = new Date(startDate);
    parashahStartDate.setDate(parashahStartDate.getDate() + (parashahIndex * 7));

    // Generate 7 daily readings for this parashah
    for (let day = 0; day < 7; day++) {
      const readingDate = new Date(parashahStartDate);
      readingDate.setDate(readingDate.getDate() + day);

      const kriyah = day + 1;
      const scriptureReadings = scriptureService.getScriptureReferences(parashah, kriyah);

      // Get haftarah for Shabbat (kriyah 7)
      const haftarahRef = kriyah === 7 ? haftarahService.getHaftarahReference(parashah) : '';

      const reading = {
        idNo: idNo++,
        parashat: parashah,
        parashatHeb: getParashahHebrew(parashah),
        parashatEng: getParashahEnglish(parashah),
        date: formatDate(readingDate),
        holiday: `Parashat ${parashah}`,
        holidayReadings: "",
        holidayDate: getHebrewDate(readingDate),
        kriyah,
        kriyahHeb: getKriyahHebrew(kriyah),
        kriyahEng: `Reading ${kriyah}`,
        kriyahDate: getHebrewDate(readingDate),
        torah: scriptureReadings?.torah?.reference || '',
        prophets: scriptureReadings?.prophets?.reference || '',
        writings: scriptureReadings?.writings?.reference || '',
        britChadashah: scriptureReadings?.britChadashah?.reference || '',
        haftarah: haftarahRef,
        apostles: scriptureReadings?.britChadashah?.reference || ''
      };

      updatedKriyah[idNo - 1] = reading;
    }
  });

  return updatedKriyah;
}

/**
 * Generate TypeScript code for the updated kriyah data
 */
function generateKriyahTypeScriptCode(kriyahData) {
  let code = 'export const KRIYAH: any = {\n';

  // Sort by idNo to maintain order
  const sortedEntries = Object.entries(kriyahData).sort((a, b) => {
    return a[1].idNo - b[1].idNo;
  });

  for (const [key, reading] of sortedEntries) {
    code += `  ${reading.idNo}: {\n`;
    code += `    idNo: ${reading.idNo},\n`;
    code += `    parashat: "${escapeForDoubleQuotes(reading.parashat)}",\n`;
    code += `    parashatHeb: "${escapeForDoubleQuotes(reading.parashatHeb)}",\n`;
    code += `    parashatEng: "${escapeForDoubleQuotes(reading.parashatEng)}",\n`;
    code += `    date: "${reading.date}",\n`;
    code += `    holiday: "${escapeForDoubleQuotes(reading.holiday)}",\n`;
    code += `    holidayReadings: "${escapeForDoubleQuotes(reading.holidayReadings)}",\n`;
    code += `    holidayDate: "${escapeForDoubleQuotes(reading.holidayDate)}",\n`;
    code += `    kriyah: ${reading.kriyah},\n`;
    code += `    kriyahHeb: "${escapeForDoubleQuotes(reading.kriyahHeb)}",\n`;
    code += `    kriyahEng: "${escapeForDoubleQuotes(reading.kriyahEng)}",\n`;
    code += `    kriyahDate: "${escapeForDoubleQuotes(reading.kriyahDate)}",\n`;
    code += `    torah: "${escapeForDoubleQuotes(reading.torah)}",\n`;
    code += `    prophets: "${escapeForDoubleQuotes(reading.prophets)}",\n`;
    code += `    writings: "${escapeForDoubleQuotes(reading.writings)}",\n`;
    code += `    britChadashah: "${escapeForDoubleQuotes(reading.britChadashah)}",\n`;
    code += `    haftarah: "${escapeForDoubleQuotes(reading.haftarah)}",\n`;
    code += `    apostles: "${escapeForDoubleQuotes(reading.apostles)}"\n`;
    code += `  },\n`;
  }

  code += '};\n';
  return code;
}

// Helper functions
function getParashahHebrew(parashah) {
  const translations = {
    'Bereshit': 'בראשית',
    'Noach': 'נח',
    'Lech Lecha': 'לך לך',
    'Vayera': 'וירא',
    'Chayei Sarah': 'חיי שרה'
  };
  return translations[parashah] || parashah;
}

function getParashahEnglish(parashah) {
  const translations = {
    'Bereshit': 'In the Beginning',
    'Noach': 'Noah',
    'Lech Lecha': 'Go Forth',
    'Vayera': 'He Appeared',
    'Chayei Sarah': 'Life of Sarah'
  };
  return translations[parashah] || parashah;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getHebrewDate(date) {
  // Mock Hebrew date for demonstration
  const hebrewMonths = ['Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Sh\'vat', 'Adar'];
  const month = hebrewMonths[date.getMonth()];
  const day = date.getDate();
  const year = 5785;
  return `${day} ${month} ${year}`;
}

function getKriyahHebrew(kriyah) {
  const hebrewNumbers = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'];
  return `קריאה ${hebrewNumbers[kriyah - 1] || kriyah}`;
}

function escapeForDoubleQuotes(str) {
  return str.replace(/"/g, '\\"');
}

/**
 * Main function to update the database
 */
function updateDatabase() {
  console.log('🔄 Starting kriyah database update...');

  try {
    const kriyahData = generateUpdatedKriyahData();
    const typescriptCode = generateKriyahTypeScriptCode(kriyahData);

    // Write to a sample file
    const outputPath = path.join(__dirname, 'sample-updated-kriyah.ts');
    fs.writeFileSync(outputPath, typescriptCode, 'utf8');

    console.log(`✅ Updated database with ${Object.keys(kriyahData).length} readings`);
    console.log(`📁 Sample file created: ${outputPath}`);

    // Show sample of what was generated
    console.log('\n📋 Sample of updated readings:');
    const lines = typescriptCode.split('\n').slice(0, 20);
    lines.forEach(line => console.log(line));
    console.log('... (truncated)');

  } catch (error) {
    console.error('❌ Database update failed:', error);
  }
}

// Run the update
updateDatabase();
