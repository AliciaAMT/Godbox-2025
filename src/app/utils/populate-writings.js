const fs = require('fs');
const path = require('path');

// Writings books in the correct order as specified by the user
const WRITINGS_BOOKS = [
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Songs', chapters: 8 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Job', chapters: 42 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Daniel', chapters: 12 }
];

// Major holidays to skip (these have special readings)
const HOLIDAYS_TO_SKIP = [
  'Rosh Hashanah',
  'Yom Kippur',
  'Sukkot',
  'Simchat Torah',
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

function populateWritings() {
  console.log('=== Populating Writings in Extended Database ===');

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

    // Find Simchat Torah dates (the day before we start writings)
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

    // Generate writings readings
    let currentBookIndex = 0;
    let currentChapter = 1;
    let writingsStarted = false;

    for (const entry of sortedEntries) {
      // Skip if this is a holiday with special readings
      if (HOLIDAYS_TO_SKIP.includes(entry.holidayName)) {
        entry.writings = '';
        continue;
      }

      // Check if we should start writings (day after Simchat Torah)
      if (!writingsStarted) {
        const entryDate = new Date(entry.date);
        for (const simchatDate of simchatTorahDates) {
          const simchatDateObj = new Date(simchatDate);
          const nextDay = new Date(simchatDateObj);
          nextDay.setDate(nextDay.getDate() + 1);

          if (entryDate.getTime() === nextDay.getTime()) {
            writingsStarted = true;
            console.log(`Starting writings on ${entry.date} (day after Simchat Torah)`);
            break;
          }
        }
      }

      // If writings haven't started yet, skip this entry
      if (!writingsStarted) {
        entry.writings = '';
        continue;
      }

      // Assign the current chapter
      const currentBook = WRITINGS_BOOKS[currentBookIndex];
      entry.writings = `${currentBook.name} ${currentChapter}`;

      // Move to next chapter
      currentChapter++;

      // If we've finished this book, move to next book
      if (currentChapter > currentBook.chapters) {
        currentBookIndex++;
        currentChapter = 1;

        // If we've finished all books, start over
        if (currentBookIndex >= WRITINGS_BOOKS.length) {
          currentBookIndex = 0;
          console.log('Completed writings cycle, starting over');
        }
      }
    }

    // Update the kriyah file with writings
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with writings');

    // Print some sample entries with writings
    console.log('\nSample entries with writings:');
    let count = 0;
    for (const entry of sortedEntries) {
      if (entry.writings && count < 10) {
        console.log(`${entry.date}: ${entry.writings}${entry.holidayName ? ` (${entry.holidayName})` : ''}`);
        count++;
      } else if (count >= 10) {
        break;
      }
    }

    // Print summary
    let writingsCount = 0;
    let holidayCount = 0;
    for (const entry of sortedEntries) {
      if (entry.writings) {
        writingsCount++;
      }
      if (entry.holidayName) {
        holidayCount++;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total entries: ${sortedEntries.length}`);
    console.log(`- Entries with writings: ${writingsCount}`);
    console.log(`- Holiday entries: ${holidayCount}`);

  } catch (error) {
    console.error('Error populating writings:', error);
    console.error(error.stack);
  }
}

// Run the script
populateWritings();
