const { HebrewCalendar, Location } = require('@hebcal/core');
const fs = require('fs');
const path = require('path');

function getJewishHolidays(year) {
  console.log(`Getting Jewish holidays for ${year}...`);
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const events = HebrewCalendar.calendar({
    start: startDate,
    end: endDate,
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });

  console.log(`Found ${events.length} total events`);

  // Filter for holiday events (not just parashot)
  const holidayEvents = events.filter(event => {
    const desc = event.getDesc();
    return desc && (
      desc.includes('Rosh Hashanah') ||
      desc.includes('Yom Kippur') ||
      desc.includes('Sukkot') ||
      desc.includes('Shmini Atzeret') ||
      desc.includes('Simchat Torah') ||
      desc.includes('Pesach') ||
      desc.includes('Shavuot') ||
      desc.includes('Purim') ||
      desc.includes('Chanukah') ||
      desc.includes('Tu BiShvat') ||
      desc.includes('Tisha B\'Av') ||
      desc.includes('Lag BaOmer') ||
      desc.includes('Yom HaAtzmaut') ||
      desc.includes('Yom HaZikaron')
    );
  });

  console.log(`Found ${holidayEvents.length} holiday events`);

  // Group events by date
  const holidaysByDate = new Map();

  holidayEvents.forEach(event => {
    const date = event.getDate().greg();
    const dateString = date.toISOString().split('T')[0];
    let desc = event.getDesc();

    // Convert Shmini Atzeret to Simchat Torah
    if (desc.includes('Shmini Atzeret')) {
      desc = desc.replace('Shmini Atzeret', 'Simchat Torah');
    }

    if (!holidaysByDate.has(dateString)) {
      holidaysByDate.set(dateString, []);
    }
    holidaysByDate.get(dateString).push(desc);
  });

  return holidaysByDate;
}

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

function updateKriyahFile(holidaysByDate) {
  console.log('Updating kriyah file with holidays...');
  const kriyahPath = path.join(__dirname, '../database/kriyah.ts');
  console.log(`Reading file from: ${kriyahPath}`);

  const content = fs.readFileSync(kriyahPath, 'utf8');
  console.log(`File size: ${content.length} characters`);

  // Parse the KRIYAH object
  const kriyahMatch = content.match(/export const KRIYAH: any = ({[\s\S]*});/);
  if (!kriyahMatch) {
    throw new Error('Could not find KRIYAH object in file');
  }

  console.log('Found KRIYAH object, parsing...');
  const kriyahString = kriyahMatch[1];
  const kriyahData = eval(`(${kriyahString})`);
  console.log(`Parsed ${Object.keys(kriyahData).length} entries`);

  // Update holidays for each entry
  let updatedCount = 0;
  Object.keys(kriyahData).forEach(key => {
    const entry = kriyahData[key];
    const holidays = holidaysByDate.get(entry.date);

    if (holidays && holidays.length > 0) {
      // Join multiple holidays for the same date
      const holidayName = holidays.join('; ');
      entry.holidayName = holidayName;

      // Get readings for the first holiday (most significant)
      const firstHoliday = holidays[0];
      const readings = getHolidayReadings(firstHoliday);
      if (readings) {
        entry.holidayReadings = readings;
      }

      updatedCount++;
    }
  });

  console.log(`Updated ${updatedCount} entries with holidays`);

  // Convert back to string
  const updatedContent = content.replace(
    /export const KRIYAH: any = {[\s\S]*};/,
    `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
  );

  fs.writeFileSync(kriyahPath, updatedContent);
  console.log('File updated successfully');
}

function populateHolidays() {
  console.log('=== Populating Jewish Holidays ===');

  try {
    // Get holidays for 2025
    const holidaysByDate = getJewishHolidays(2025);
    console.log(`Found holidays for ${holidaysByDate.size} dates`);

    // Update kriyah file
    updateKriyahFile(holidaysByDate);
    console.log('Successfully updated kriyah.ts file with holidays');

    // Print some sample holidays
    console.log('\nSample holidays:');
    let count = 0;
    for (const [date, holidays] of holidaysByDate) {
      if (count < 10) {
        console.log(`${date}: ${holidays.join('; ')}`);
        count++;
      } else {
        break;
      }
    }

  } catch (error) {
    console.error('Error populating holidays:', error);
    console.error(error.stack);
  }
}

// Run the script
populateHolidays();
