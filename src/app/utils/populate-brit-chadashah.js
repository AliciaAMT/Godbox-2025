const fs = require('fs');
const path = require('path');

// New Testament books and their chapter counts
const NEW_TESTAMENT_BOOKS = [
  { name: 'John', chapters: 21 },
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
];

// Holidays to skip (except Simchat Torah)
const HOLIDAYS_TO_SKIP = [
  'Rosh Hashanah',
  'Yom Kippur',
  'Sukkot',
  'Pesach',
  'Shavuot',
  'Purim',
  'Chanukah',
  'Tu BiShvat',
  'Tisha B\'Av',
  'Lag BaOmer',
  'Yom HaAtzmaut',
  'Yom HaZikaron'
];

function isSabbath(entry) {
  // Check if this is a Sabbath (has a parashat)
  return entry.parashat && entry.parashat.length > 0;
}

function populateBritChadashah() {
  console.log('=== Populating Brit Chadashah Readings ===');

  try {
    // Read the kriyah file
    const kriyahPath = path.join(__dirname, '../database/kriyah.ts');
    const content = fs.readFileSync(kriyahPath, 'utf8');

    // Extract the KRIYAH object
    const kriyahMatch = content.match(/export const KRIYAH: any = ({[\s\S]*});/);
    if (!kriyahMatch) {
      throw new Error('Could not find KRIYAH object in file');
    }

    const kriyahData = JSON.parse(kriyahMatch[1]);
    console.log(`Found ${Object.keys(kriyahData).length} entries in database`);

    // Find Simchat Torah dates (the day we start Brit Chadashah)
    const simchatTorahDates = [];
    for (const [id, entry] of Object.entries(kriyahData)) {
      if (entry.holidayName === 'Simchat Torah') {
        simchatTorahDates.push(entry.date);
      }
    }

    console.log('Simchat Torah dates found:', simchatTorahDates);

    // Sort entries by date to ensure proper order
    const sortedEntries = Object.values(kriyahData).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    // Generate Brit Chadashah readings
    let currentBookIndex = 0;
    let currentChapter = 1;
    let britChadashahStarted = false;

    for (const entry of sortedEntries) {
      // Check if this is a holiday to skip (except Simchat Torah)
      if (HOLIDAYS_TO_SKIP.includes(entry.holidayName)) {
        entry.britChadashah = '';
        continue;
      }

      // Check if this is a Sabbath to skip
      if (isSabbath(entry)) {
        entry.britChadashah = '';
        continue;
      }

      // Check if we should start Brit Chadashah (on Simchat Torah)
      if (!britChadashahStarted) {
        const entryDate = new Date(entry.date);
        for (const simchatDate of simchatTorahDates) {
          const simchatDateObj = new Date(simchatDate);

          if (entryDate.getTime() === simchatDateObj.getTime()) {
            britChadashahStarted = true;
            console.log(`Starting Brit Chadashah on ${entry.date} (Simchat Torah)`);
            break;
          }
        }
      }

      // If Brit Chadashah hasn't started yet, skip this entry
      if (!britChadashahStarted) {
        entry.britChadashah = '';
        continue;
      }

      // Assign the current chapter
      if (currentBookIndex < NEW_TESTAMENT_BOOKS.length) {
        const currentBook = NEW_TESTAMENT_BOOKS[currentBookIndex];
        entry.britChadashah = `${currentBook.name} ${currentChapter}`;

        // Move to next chapter
        currentChapter++;

        // If we've finished this book, move to next book
        if (currentChapter > currentBook.chapters) {
          currentBookIndex++;
          currentChapter = 1;
        }
      } else {
        // We've finished all books, pause until next Simchat Torah
        entry.britChadashah = '';
      }

      // Check if we've reached the next Simchat Torah and should restart
      const entryDate = new Date(entry.date);
      for (const simchatDate of simchatTorahDates) {
        const simchatDateObj = new Date(simchatDate);

        if (entryDate.getTime() === simchatDateObj.getTime() && currentBookIndex >= NEW_TESTAMENT_BOOKS.length) {
          currentBookIndex = 0;
          currentChapter = 1;
          console.log(`Restarting Brit Chadashah on ${entry.date} (Simchat Torah)`);
          entry.britChadashah = 'John 1';
          currentBookIndex = 0;
          currentChapter = 2;
        }
      }
    }

    // Update the kriyah file with Brit Chadashah
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with Brit Chadashah');

    // Print some sample entries with Brit Chadashah
    console.log('\nSample entries with Brit Chadashah:');
    let count = 0;
    for (const entry of sortedEntries) {
      if (entry.britChadashah && count < 10) {
        console.log(`${entry.date}: ${entry.britChadashah}${entry.holidayName ? ` (${entry.holidayName})` : ''}`);
        count++;
      } else if (count >= 10) {
        break;
      }
    }

    // Print summary
    let britChadashahCount = 0;
    let sabbathCount = 0;
    let holidayCount = 0;
    for (const entry of sortedEntries) {
      if (entry.britChadashah) {
        britChadashahCount++;
      }
      if (isSabbath(entry)) {
        sabbathCount++;
      }
      if (entry.holidayName && HOLIDAYS_TO_SKIP.includes(entry.holidayName)) {
        holidayCount++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total entries: ${sortedEntries.length}`);
    console.log(`- Entries with Brit Chadashah: ${britChadashahCount}`);
    console.log(`- Sabbath entries skipped: ${sabbathCount}`);
    console.log(`- Holiday entries skipped: ${holidayCount}`);

  } catch (error) {
    console.error('Error populating Brit Chadashah:', error);
    console.error(error.stack);
  }
}

// Run the script
populateBritChadashah();
