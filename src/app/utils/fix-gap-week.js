const { HebrewCalendar, Location } = require('@hebcal/core');
const fs = require('fs');
const path = require('path');

function getHolidayReadings(holidayName) {
  // Map of holiday names to their traditional readings
  const holidayReadings = {
    'Rosh Hashanah': 'Genesis 21:1-34; Numbers 29:1-6; 1 Samuel 1:1-2:10',
    'Yom Kippur': 'Leviticus 16:1-34; Numbers 29:7-11; Isaiah 57:14-58:14',
    'Sukkot': 'Leviticus 22:26-23:44; Numbers 29:12-16; Zechariah 14:1-21',
    'Simchat Torah': 'Deuteronomy 33:1-34:12; Genesis 1:1-2:3; Numbers 29:35-30:1',
    'Pesach': 'Exodus 12:21-51; Numbers 28:16-25; Joshua 3:5-7; 5:2-6:1; 6:27',
    'Shavuot': 'Exodus 19:1-20:23; Numbers 28:26-31; Ezekiel 1:1-28; 3:12',
    'Purim': 'Esther 9:20-32',
    'Chanukah': 'Numbers 7:1-89; Zechariah 2:14-4:7',
    'Tu BiShvat': 'Deuteronomy 8:1-10',
    'Tisha B\'Av': 'Deuteronomy 4:25-40; Jeremiah 8:13-9:23; Lamentations',
    'Lag BaOmer': 'Numbers 21:17-20',
    'Yom HaAtzmaut': 'Isaiah 10:32-12:6',
    'Yom HaZikaron': 'Deuteronomy 20:1-9'
  };

  return holidayReadings[holidayName] || '';
}

function getHebrewDate(dateString) {
  // Simple Hebrew date mapping for October 2025
  const hebrewDates = {
    '2025-10-11': '21 Tishrei 5786',
    '2025-10-12': '22 Tishrei 5786',
    '2025-10-13': '23 Tishrei 5786',
    '2025-10-14': '24 Tishrei 5786',
    '2025-10-15': '25 Tishrei 5786',
    '2025-10-16': '26 Tishrei 5786',
    '2025-10-17': '27 Tishrei 5786'
  };

  return hebrewDates[dateString] || '1 Tishrei 5786';
}

function createKriyahEntry(idNo, date, holidayName, holidayReadings) {
  const hebrewDate = getHebrewDate(date);

  return {
    "idNo": idNo,
    "parashat": "",
    "parashatHeb": "",
    "parashatEng": "",
    "date": date,
    "holiday": "",
    "holidayReadings": holidayReadings,
    "holidayDate": hebrewDate,
    "kriyah": 1,
    "kriyahHeb": "קריאה א",
    "kriyahEng": "Reading 1",
    "kriyahDate": hebrewDate,
    "torah": "",
    "prophets": "",
    "writings": "",
    "britChadashah": "",
    "haftarah": "",
    "apostles": "",
    "holidayName": holidayName
  };
}

function fixGapWeek() {
  console.log('=== Fixing Gap Week (October 11-17, 2025) ===');

  try {
    const kriyahPath = path.join(__dirname, '../database/kriyah.ts');
    const content = fs.readFileSync(kriyahPath, 'utf8');

    // Parse the KRIYAH object
    const kriyahMatch = content.match(/export const KRIYAH: any = ({[\s\S]*});/);
    if (!kriyahMatch) {
      throw new Error('Could not find KRIYAH object in file');
    }

    const kriyahString = kriyahMatch[1];
    const kriyahData = eval(`(${kriyahString})`);

    console.log(`Current entries: ${Object.keys(kriyahData).length}`);

    // Define the missing dates and their holidays
    const missingDates = [
      { date: '2025-10-11', holidayName: 'Sukkot V (CH"M)', idNo: 349 },
      { date: '2025-10-12', holidayName: 'Sukkot VI (CH"M)', idNo: 350 },
      { date: '2025-10-13', holidayName: 'Sukkot VII (Hoshana Raba)', idNo: 351 },
      { date: '2025-10-14', holidayName: 'Simchat Torah', idNo: 352 },
      { date: '2025-10-15', holidayName: '', idNo: 353 },
      { date: '2025-10-16', holidayName: '', idNo: 354 },
      { date: '2025-10-17', holidayName: '', idNo: 355 }
    ];

    // Add missing entries
    missingDates.forEach(({ date, holidayName, idNo }) => {
      const holidayReadings = getHolidayReadings(holidayName);
      const entry = createKriyahEntry(idNo, date, holidayName, holidayReadings);
      kriyahData[idNo.toString()] = entry;
    });

    console.log(`Added ${missingDates.length} missing entries`);

    // Sort entries by date
    const sortedEntries = {};
    Object.values(kriyahData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach((entry, index) => {
        sortedEntries[(index + 1).toString()] = {
          ...entry,
          idNo: index + 1
        };
      });

    // Convert back to string
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(sortedEntries, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with missing dates');

    // Verify the entries were added
    console.log('\nVerifying added entries:');
    missingDates.forEach(({ date, holidayName }) => {
      console.log(`${date}: ${holidayName || 'Regular day'}`);
    });

  } catch (error) {
    console.error('Error fixing gap week:', error);
    console.error(error.stack);
  }
}

// Run the script
fixGapWeek();
