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
  // Simple Hebrew date mapping for common dates
  const hebrewDates = {
    // 2025 dates
    '2025-01-01': '1 Tevet 5785',
    '2025-01-02': '2 Tevet 5785',
    '2025-12-31': '10 Tevet 5786',
    // 2026 dates
    '2026-01-01': '21 Tevet 5786',
    '2026-12-31': '21 Tevet 5787',
    // 2027 dates
    '2027-01-01': '2 Shevat 5787',
    '2027-12-31': '2 Shevat 5788',
    // 2028 dates
    '2028-01-01': '13 Shevat 5788',
    '2028-12-31': '13 Shevat 5789'
  };

  return hebrewDates[dateString] || '1 Tishrei 5785';
}

function createKriyahEntry(idNo, date, parashat, parashatHeb, parashatEng, holidayName, holidayReadings) {
  const hebrewDate = getHebrewDate(date);

  return {
    "idNo": idNo,
    "parashat": parashat,
    "parashatHeb": parashatHeb,
    "parashatEng": parashatEng,
    "date": date,
    "holiday": parashat ? `Parashat ${parashat}` : "",
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

function getParashatInfo(parashatName) {
  const parashatMap = {
    'Bereshit': { heb: 'בראשית', eng: 'In the Beginning' },
    'Noach': { heb: 'נח', eng: 'Noah' },
    'Lech-Lecha': { heb: 'לך לך', eng: 'Go Forth' },
    'Vayera': { heb: 'וירא', eng: 'He Appeared' },
    'Chayei Sara': { heb: 'חיי שרה', eng: 'Life of Sarah' },
    'Toldot': { heb: 'תולדות', eng: 'Generations' },
    'Vayetzei': { heb: 'ויצא', eng: 'He Went Out' },
    'Vayishlach': { heb: 'וישלח', eng: 'He Sent' },
    'Vayeshev': { heb: 'וישב', eng: 'He Settled' },
    'Miketz': { heb: 'מקץ', eng: 'At the End' },
    'Vayigash': { heb: 'ויגש', eng: 'He Approached' },
    'Vayechi': { heb: 'ויחי', eng: 'He Lived' },
    'Shemot': { heb: 'שמות', eng: 'Names' },
    'Vaera': { heb: 'וארא', eng: 'I Appeared' },
    'Bo': { heb: 'בא', eng: 'Go' },
    'Beshalach': { heb: 'בשלח', eng: 'When He Sent' },
    'Yitro': { heb: 'יתרו', eng: 'Jethro' },
    'Mishpatim': { heb: 'משפטים', eng: 'Laws' },
    'Terumah': { heb: 'תרומה', eng: 'Offering' },
    'Tetzaveh': { heb: 'תצוה', eng: 'You Shall Command' },
    'Ki Tisa': { heb: 'כי תשא', eng: 'When You Take' },
    'Vayakhel': { heb: 'ויקהל', eng: 'He Assembled' },
    'Pekudei': { heb: 'פקודי', eng: 'Accounts' },
    'Vayikra': { heb: 'ויקרא', eng: 'He Called' },
    'Tzav': { heb: 'צו', eng: 'Command' },
    'Shmini': { heb: 'שמיני', eng: 'Eighth' },
    'Tazria': { heb: 'תזריע', eng: 'She Bears Seed' },
    'Metzora': { heb: 'מצרע', eng: 'Leper' },
    'Achrei Mot': { heb: 'אחרי מות', eng: 'After Death' },
    'Kedoshim': { heb: 'קדשים', eng: 'Holy Ones' },
    'Emor': { heb: 'אמור', eng: 'Say' },
    'Behar': { heb: 'בהר', eng: 'On the Mountain' },
    'Bechukotai': { heb: 'בחקתי', eng: 'In My Statutes' },
    'Bamidbar': { heb: 'במדבר', eng: 'In the Wilderness' },
    'Nasso': { heb: 'נשא', eng: 'Take' },
    'Beha\'alotcha': { heb: 'בהעלתך', eng: 'When You Raise' },
    'Sh\'lach': { heb: 'שלח', eng: 'Send' },
    'Korach': { heb: 'קרח', eng: 'Korach' },
    'Chukat': { heb: 'חקת', eng: 'Statute' },
    'Balak': { heb: 'בלק', eng: 'Balak' },
    'Pinchas': { heb: 'פינחס', eng: 'Pinchas' },
    'Matot': { heb: 'מטות', eng: 'Tribes' },
    'Masei': { heb: 'מסעי', eng: 'Journeys' },
    'Devarim': { heb: 'דברים', eng: 'Words' },
    'Vaetchanan': { heb: 'ואתחנן', eng: 'I Pleaded' },
    'Eikev': { heb: 'עקב', eng: 'Because' },
    'Re\'eh': { heb: 'ראה', eng: 'See' },
    'Shoftim': { heb: 'שופטים', eng: 'Judges' },
    'Ki Teitzei': { heb: 'כי תצא', eng: 'When You Go Out' },
    'Ki Tavo': { heb: 'כי תבוא', eng: 'When You Come' },
    'Nitzavim': { heb: 'נצבים', eng: 'Standing' },
    'Vayeilech': { heb: 'וילך', eng: 'He Went' },
    'Ha\'Azinu': { heb: 'האזינו', eng: 'Listen' },
    'Vezot Haberakhah': { heb: 'וזאת הברכה', eng: 'This is the Blessing' }
  };

  return parashatMap[parashatName] || { heb: '', eng: '' };
}

function extendDatabase() {
  console.log('=== Extending Database with Multiple Years ===');

  try {
    const startYear = 2025;
    const endYear = 2028;

    console.log(`Generating data for years ${startYear}-${endYear}...`);

    const allEntries = {};
    let entryId = 1;

    for (let year = startYear; year <= endYear; year++) {
      console.log(`Processing year ${year}...`);

      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);

      const events = HebrewCalendar.calendar({
        start: startDate,
        end: endDate,
        location: Location.lookup('Jerusalem'),
        sedrot: true,
        candlelighting: false
      });

      console.log(`Found ${events.length} events for ${year}`);

      // Group events by date
      const eventsByDate = new Map();

      events.forEach(event => {
        const date = event.getDate().greg();
        const dateString = date.toISOString().split('T')[0];
        const desc = event.getDesc();

        if (!eventsByDate.has(dateString)) {
          eventsByDate.set(dateString, []);
        }
        eventsByDate.get(dateString).push(desc);
      });

      // Create entries for each date
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const dayEvents = eventsByDate.get(dateString) || [];

        // Find parashat
        let parashat = '';
        let parashatHeb = '';
        let parashatEng = '';

        // Find holiday
        let holidayName = '';
        let holidayReadings = '';

        dayEvents.forEach(eventDesc => {
          if (eventDesc.includes('Parashat')) {
            parashat = eventDesc.replace('Parashat ', '');
            const parashatInfo = getParashatInfo(parashat);
            parashatHeb = parashatInfo.heb;
            parashatEng = parashatInfo.eng;
          } else if (
            eventDesc.includes('Rosh Hashanah') ||
            eventDesc.includes('Yom Kippur') ||
            eventDesc.includes('Sukkot') ||
            eventDesc.includes('Shmini Atzeret') ||
            eventDesc.includes('Simchat Torah') ||
            eventDesc.includes('Pesach') ||
            eventDesc.includes('Shavuot') ||
            eventDesc.includes('Purim') ||
            eventDesc.includes('Chanukah') ||
            eventDesc.includes('Tu BiShvat') ||
            eventDesc.includes('Tisha B\'Av') ||
            eventDesc.includes('Lag BaOmer') ||
            eventDesc.includes('Yom HaAtzmaut') ||
            eventDesc.includes('Yom HaZikaron')
          ) {
            // Convert Shmini Atzeret to Simchat Torah
            if (eventDesc.includes('Shmini Atzeret')) {
              holidayName = eventDesc.replace('Shmini Atzeret', 'Simchat Torah');
            } else {
              holidayName = eventDesc;
            }
            holidayReadings = getHolidayReadings(holidayName);
          }
        });

        // Create entry
        const entry = createKriyahEntry(
          entryId,
          dateString,
          parashat,
          parashatHeb,
          parashatEng,
          holidayName,
          holidayReadings
        );

        allEntries[entryId.toString()] = entry;
        entryId++;

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    console.log(`Generated ${Object.keys(allEntries).length} total entries`);

    // Update the kriyah file
    const kriyahPath = path.join(__dirname, '../database/kriyah.ts');
    const content = fs.readFileSync(kriyahPath, 'utf8');

    // Replace the KRIYAH object
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(allEntries, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with extended data');

    // Print some sample entries
    console.log('\nSample entries:');
    let count = 0;
    for (const [id, entry] of Object.entries(allEntries)) {
      if (count < 10) {
        console.log(`${entry.date}: ${entry.parashat || entry.holidayName || 'Regular day'}`);
        count++;
      } else {
        break;
      }
    }

  } catch (error) {
    console.error('Error extending database:', error);
    console.error(error.stack);
  }
}

// Run the script
extendDatabase();
