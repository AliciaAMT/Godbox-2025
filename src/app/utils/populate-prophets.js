const fs = require('fs');
const path = require('path');

// Neviim schedule from the JSON file
const NEVIIM_SCHEDULE = [
  { day: 1, reading: "Joshua 1" },
  { day: 2, reading: "Joshua 2" },
  { day: 3, reading: "Joshua 3" },
  { day: 4, reading: "Joshua 4" },
  { day: 5, reading: "Joshua 5" },
  { day: 6, reading: "Joshua 6" },
  { day: 7, reading: "Joshua 7" },
  { day: 8, reading: "Joshua 8" },
  { day: 9, reading: "Joshua 9" },
  { day: 10, reading: "Joshua 10–11" },
  { day: 11, reading: "Joshua 12" },
  { day: 12, reading: "Joshua 13" },
  { day: 13, reading: "Joshua 14" },
  { day: 14, reading: "Joshua 15" },
  { day: 15, reading: "Joshua 16" },
  { day: 16, reading: "Joshua 17" },
  { day: 17, reading: "Joshua 18" },
  { day: 18, reading: "Joshua 19" },
  { day: 19, reading: "Joshua 20–21" },
  { day: 20, reading: "Joshua 22" },
  { day: 21, reading: "Joshua 23" },
  { day: 22, reading: "Joshua 24" },
  { day: 23, reading: "Judges 1" },
  { day: 24, reading: "Judges 2" },
  { day: 25, reading: "Judges 3" },
  { day: 26, reading: "Judges 4" },
  { day: 27, reading: "Judges 5" },
  { day: 28, reading: "Judges 6" },
  { day: 29, reading: "Judges 7" },
  { day: 30, reading: "Judges 8" },
  { day: 31, reading: "Judges 9" },
  { day: 32, reading: "Judges 10–11" },
  { day: 33, reading: "Judges 12" },
  { day: 34, reading: "Judges 13" },
  { day: 35, reading: "Judges 14" },
  { day: 36, reading: "Judges 15" },
  { day: 37, reading: "Judges 16" },
  { day: 38, reading: "Judges 17" },
  { day: 39, reading: "Judges 18" },
  { day: 40, reading: "Judges 19" },
  { day: 41, reading: "Judges 20–21" },
  { day: 42, reading: "1 Samuel 1" },
  { day: 43, reading: "1 Samuel 2" },
  { day: 44, reading: "1 Samuel 3" },
  { day: 45, reading: "1 Samuel 4" },
  { day: 46, reading: "1 Samuel 5" },
  { day: 47, reading: "1 Samuel 6" },
  { day: 48, reading: "1 Samuel 7" },
  { day: 49, reading: "1 Samuel 8" },
  { day: 50, reading: "1 Samuel 9" },
  { day: 51, reading: "1 Samuel 10–11" },
  { day: 52, reading: "1 Samuel 12" },
  { day: 53, reading: "1 Samuel 13" },
  { day: 54, reading: "1 Samuel 14" },
  { day: 55, reading: "1 Samuel 15" },
  { day: 56, reading: "1 Samuel 16" },
  { day: 57, reading: "1 Samuel 17" },
  { day: 58, reading: "1 Samuel 18" },
  { day: 59, reading: "1 Samuel 19" },
  { day: 60, reading: "1 Samuel 20–21" },
  { day: 61, reading: "1 Samuel 22" },
  { day: 62, reading: "1 Samuel 23" },
  { day: 63, reading: "1 Samuel 24" },
  { day: 64, reading: "1 Samuel 25" },
  { day: 65, reading: "1 Samuel 26" },
  { day: 66, reading: "1 Samuel 27" },
  { day: 67, reading: "1 Samuel 28" },
  { day: 68, reading: "1 Samuel 29" },
  { day: 69, reading: "1 Samuel 30–31" },
  { day: 70, reading: "2 Samuel 1" },
  { day: 71, reading: "2 Samuel 2" },
  { day: 72, reading: "2 Samuel 3" },
  { day: 73, reading: "2 Samuel 4" },
  { day: 74, reading: "2 Samuel 5" },
  { day: 75, reading: "2 Samuel 6" },
  { day: 76, reading: "2 Samuel 7" },
  { day: 77, reading: "2 Samuel 8" },
  { day: 78, reading: "2 Samuel 9" },
  { day: 79, reading: "2 Samuel 10–11" },
  { day: 80, reading: "2 Samuel 12" },
  { day: 81, reading: "2 Samuel 13" },
  { day: 82, reading: "2 Samuel 14" },
  { day: 83, reading: "2 Samuel 15" },
  { day: 84, reading: "2 Samuel 16" },
  { day: 85, reading: "2 Samuel 17" },
  { day: 86, reading: "2 Samuel 18" },
  { day: 87, reading: "2 Samuel 19" },
  { day: 88, reading: "2 Samuel 20–21" },
  { day: 89, reading: "2 Samuel 22" },
  { day: 90, reading: "2 Samuel 23" },
  { day: 91, reading: "2 Samuel 24" },
  { day: 92, reading: "1 Kings 1" },
  { day: 93, reading: "1 Kings 2" },
  { day: 94, reading: "1 Kings 3" },
  { day: 95, reading: "1 Kings 4" },
  { day: 96, reading: "1 Kings 5" },
  { day: 97, reading: "1 Kings 6" },
  { day: 98, reading: "1 Kings 7" },
  { day: 99, reading: "1 Kings 8" },
  { day: 100, reading: "1 Kings 9" },
  { day: 101, reading: "1 Kings 10–11" },
  { day: 102, reading: "1 Kings 12" },
  { day: 103, reading: "1 Kings 13" },
  { day: 104, reading: "1 Kings 14" },
  { day: 105, reading: "1 Kings 15" },
  { day: 106, reading: "1 Kings 16" },
  { day: 107, reading: "1 Kings 17" },
  { day: 108, reading: "1 Kings 18" },
  { day: 109, reading: "1 Kings 19" },
  { day: 110, reading: "1 Kings 20–21" },
  { day: 111, reading: "1 Kings 22" },
  { day: 112, reading: "2 Kings 1" },
  { day: 113, reading: "2 Kings 2" },
  { day: 114, reading: "2 Kings 3" },
  { day: 115, reading: "2 Kings 4" },
  { day: 116, reading: "2 Kings 5" },
  { day: 117, reading: "2 Kings 6" },
  { day: 118, reading: "2 Kings 7" },
  { day: 119, reading: "2 Kings 8" },
  { day: 120, reading: "2 Kings 9" },
  { day: 121, reading: "2 Kings 10–11" },
  { day: 122, reading: "2 Kings 12" },
  { day: 123, reading: "2 Kings 13" },
  { day: 124, reading: "2 Kings 14" },
  { day: 125, reading: "2 Kings 15" },
  { day: 126, reading: "2 Kings 16" },
  { day: 127, reading: "2 Kings 17" },
  { day: 128, reading: "2 Kings 18" },
  { day: 129, reading: "2 Kings 19" },
  { day: 130, reading: "2 Kings 20–21" },
  { day: 131, reading: "2 Kings 22" },
  { day: 132, reading: "2 Kings 23" },
  { day: 133, reading: "2 Kings 24" },
  { day: 134, reading: "2 Kings 25" },
  { day: 135, reading: "Isaiah 1" },
  { day: 136, reading: "Isaiah 2" },
  { day: 137, reading: "Isaiah 3" },
  { day: 138, reading: "Isaiah 4" },
  { day: 139, reading: "Isaiah 5" },
  { day: 140, reading: "Isaiah 6" },
  { day: 141, reading: "Isaiah 7" },
  { day: 142, reading: "Isaiah 8" },
  { day: 143, reading: "Isaiah 9" },
  { day: 144, reading: "Isaiah 10–11" },
  { day: 145, reading: "Isaiah 12" },
  { day: 146, reading: "Isaiah 13" },
  { day: 147, reading: "Isaiah 14" },
  { day: 148, reading: "Isaiah 15" },
  { day: 149, reading: "Isaiah 16" },
  { day: 150, reading: "Isaiah 17" },
  { day: 151, reading: "Isaiah 18" },
  { day: 152, reading: "Isaiah 19" },
  { day: 153, reading: "Isaiah 20–21" },
  { day: 154, reading: "Isaiah 22" },
  { day: 155, reading: "Isaiah 23" },
  { day: 156, reading: "Isaiah 24" },
  { day: 157, reading: "Isaiah 25" },
  { day: 158, reading: "Isaiah 26" },
  { day: 159, reading: "Isaiah 27" },
  { day: 160, reading: "Isaiah 28" },
  { day: 161, reading: "Isaiah 29" },
  { day: 162, reading: "Isaiah 30–31" },
  { day: 163, reading: "Isaiah 32" },
  { day: 164, reading: "Isaiah 33" },
  { day: 165, reading: "Isaiah 34" },
  { day: 166, reading: "Isaiah 35" },
  { day: 167, reading: "Isaiah 36" },
  { day: 168, reading: "Isaiah 37" },
  { day: 169, reading: "Isaiah 38" },
  { day: 170, reading: "Isaiah 39" },
  { day: 171, reading: "Isaiah 40–41" },
  { day: 172, reading: "Isaiah 42" },
  { day: 173, reading: "Isaiah 43" },
  { day: 174, reading: "Isaiah 44" },
  { day: 175, reading: "Isaiah 45" },
  { day: 176, reading: "Isaiah 46" },
  { day: 177, reading: "Isaiah 47" },
  { day: 178, reading: "Isaiah 48" },
  { day: 179, reading: "Isaiah 49" },
  { day: 180, reading: "Isaiah 50–51" },
  { day: 181, reading: "Isaiah 52" },
  { day: 182, reading: "Isaiah 53" },
  { day: 183, reading: "Isaiah 54" },
  { day: 184, reading: "Isaiah 55" },
  { day: 185, reading: "Isaiah 56" },
  { day: 186, reading: "Isaiah 57" },
  { day: 187, reading: "Isaiah 58" },
  { day: 188, reading: "Isaiah 59" },
  { day: 189, reading: "Isaiah 60–61" },
  { day: 190, reading: "Isaiah 62" },
  { day: 191, reading: "Isaiah 63" },
  { day: 192, reading: "Isaiah 64" },
  { day: 193, reading: "Isaiah 65" },
  { day: 194, reading: "Isaiah 66" },
  { day: 195, reading: "Jeremiah 1" },
  { day: 196, reading: "Jeremiah 2" },
  { day: 197, reading: "Jeremiah 3" },
  { day: 198, reading: "Jeremiah 4" },
  { day: 199, reading: "Jeremiah 5" },
  { day: 200, reading: "Jeremiah 6" },
  { day: 201, reading: "Jeremiah 7" },
  { day: 202, reading: "Jeremiah 8" },
  { day: 203, reading: "Jeremiah 9" },
  { day: 204, reading: "Jeremiah 10–11" },
  { day: 205, reading: "Jeremiah 12" },
  { day: 206, reading: "Jeremiah 13" },
  { day: 207, reading: "Jeremiah 14" },
  { day: 208, reading: "Jeremiah 15" },
  { day: 209, reading: "Jeremiah 16" },
  { day: 210, reading: "Jeremiah 17" },
  { day: 211, reading: "Jeremiah 18" },
  { day: 212, reading: "Jeremiah 19" },
  { day: 213, reading: "Jeremiah 20–21" },
  { day: 214, reading: "Jeremiah 22" },
  { day: 215, reading: "Jeremiah 23" },
  { day: 216, reading: "Jeremiah 24" },
  { day: 217, reading: "Jeremiah 25" },
  { day: 218, reading: "Jeremiah 26" },
  { day: 219, reading: "Jeremiah 27" },
  { day: 220, reading: "Jeremiah 28" },
  { day: 221, reading: "Jeremiah 29" },
  { day: 222, reading: "Jeremiah 30–31" },
  { day: 223, reading: "Jeremiah 32" },
  { day: 224, reading: "Jeremiah 33" },
  { day: 225, reading: "Jeremiah 34" },
  { day: 226, reading: "Jeremiah 35" },
  { day: 227, reading: "Jeremiah 36" },
  { day: 228, reading: "Jeremiah 37" },
  { day: 229, reading: "Jeremiah 38" },
  { day: 230, reading: "Jeremiah 39" },
  { day: 231, reading: "Jeremiah 40–41" },
  { day: 232, reading: "Jeremiah 42" },
  { day: 233, reading: "Jeremiah 43" },
  { day: 234, reading: "Jeremiah 44" },
  { day: 235, reading: "Jeremiah 45" },
  { day: 236, reading: "Jeremiah 46" },
  { day: 237, reading: "Jeremiah 47" },
  { day: 238, reading: "Jeremiah 48" },
  { day: 239, reading: "Jeremiah 49" },
  { day: 240, reading: "Jeremiah 50–51" },
  { day: 241, reading: "Jeremiah 52" },
  { day: 242, reading: "Ezekiel 1" },
  { day: 243, reading: "Ezekiel 2" },
  { day: 244, reading: "Ezekiel 3" },
  { day: 245, reading: "Ezekiel 4" },
  { day: 246, reading: "Ezekiel 5" },
  { day: 247, reading: "Ezekiel 6" },
  { day: 248, reading: "Ezekiel 7" },
  { day: 249, reading: "Ezekiel 8" },
  { day: 250, reading: "Ezekiel 9" },
  { day: 251, reading: "Ezekiel 10–11" },
  { day: 252, reading: "Ezekiel 12" },
  { day: 253, reading: "Ezekiel 13" },
  { day: 254, reading: "Ezekiel 14" },
  { day: 255, reading: "Ezekiel 15" },
  { day: 256, reading: "Ezekiel 16" },
  { day: 257, reading: "Ezekiel 17" },
  { day: 258, reading: "Ezekiel 18" },
  { day: 259, reading: "Ezekiel 19" },
  { day: 260, reading: "Ezekiel 20–21" },
  { day: 261, reading: "Ezekiel 22" },
  { day: 262, reading: "Ezekiel 23" },
  { day: 263, reading: "Ezekiel 24" },
  { day: 264, reading: "Ezekiel 25" },
  { day: 265, reading: "Ezekiel 26" },
  { day: 266, reading: "Ezekiel 27" },
  { day: 267, reading: "Ezekiel 28" },
  { day: 268, reading: "Ezekiel 29" },
  { day: 269, reading: "Ezekiel 30–31" },
  { day: 270, reading: "Ezekiel 32" },
  { day: 271, reading: "Ezekiel 33" },
  { day: 272, reading: "Ezekiel 34" },
  { day: 273, reading: "Ezekiel 35" },
  { day: 274, reading: "Ezekiel 36" },
  { day: 275, reading: "Ezekiel 37" },
  { day: 276, reading: "Ezekiel 38" },
  { day: 277, reading: "Ezekiel 39" },
  { day: 278, reading: "Ezekiel 40–41" },
  { day: 279, reading: "Ezekiel 42" },
  { day: 280, reading: "Ezekiel 43" },
  { day: 281, reading: "Ezekiel 44" },
  { day: 282, reading: "Ezekiel 45" },
  { day: 283, reading: "Ezekiel 46" },
  { day: 284, reading: "Ezekiel 47" },
  { day: 285, reading: "Ezekiel 48" },
  { day: 286, reading: "Hosea 1" },
  { day: 287, reading: "Hosea 2" },
  { day: 288, reading: "Hosea 3" },
  { day: 289, reading: "Hosea 4" },
  { day: 290, reading: "Hosea 5" },
  { day: 291, reading: "Hosea 6" },
  { day: 292, reading: "Hosea 7" },
  { day: 293, reading: "Hosea 8" },
  { day: 294, reading: "Hosea 9" },
  { day: 295, reading: "Hosea 10–11" },
  { day: 296, reading: "Hosea 12" },
  { day: 297, reading: "Hosea 13" },
  { day: 298, reading: "Hosea 14" },
  { day: 299, reading: "Joel 1–3" },
  { day: 300, reading: "Amos 1" },
  { day: 301, reading: "Amos 2" },
  { day: 302, reading: "Amos 3" },
  { day: 303, reading: "Amos 4" },
  { day: 304, reading: "Amos 5" },
  { day: 305, reading: "Amos 6" },
  { day: 306, reading: "Amos 7" },
  { day: 307, reading: "Amos 8" },
  { day: 308, reading: "Amos 9" },
  { day: 309, reading: "Obadiah 1" },
  { day: 310, reading: "Micah 1" },
  { day: 311, reading: "Micah 2" },
  { day: 312, reading: "Micah 3" },
  { day: 313, reading: "Micah 4" },
  { day: 314, reading: "Micah 5" },
  { day: 315, reading: "Micah 6" },
  { day: 316, reading: "Micah 7" },
  { day: 317, reading: "Nahum 1–3" },
  { day: 318, reading: "Habakkuk 1–3" },
  { day: 319, reading: "Zephaniah 1–3" },
  { day: 320, reading: "Haggai 1–2" },
  { day: 321, reading: "Zechariah 1" },
  { day: 322, reading: "Zechariah 2" },
  { day: 323, reading: "Zechariah 3" },
  { day: 324, reading: "Zechariah 4" },
  { day: 325, reading: "Zechariah 5" },
  { day: 326, reading: "Zechariah 6" },
  { day: 327, reading: "Zechariah 7" },
  { day: 328, reading: "Zechariah 8" },
  { day: 329, reading: "Zechariah 9" },
  { day: 330, reading: "Zechariah 10–11" },
  { day: 331, reading: "Zechariah 12" },
  { day: 332, reading: "Zechariah 13" },
  { day: 333, reading: "Zechariah 14" },
  { day: 334, reading: "Malachi 1" },
  { day: 335, reading: "Malachi 2" },
  { day: 336, reading: "Malachi 3" },
  { day: 337, reading: "Malachi 4" }
];

function populateProphets() {
  console.log('=== Populating Prophets Readings ===');

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

    // Find Simchat Torah dates (the day we start prophets)
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

    // Generate prophets readings
    let currentDayIndex = 0;
    let prophetsStarted = false;

    for (const entry of sortedEntries) {
      // Check if this is Yom Kippur - use Jonah
      if (entry.holidayName === 'Yom Kippur') {
        entry.prophets = 'Jonah';
        continue;
      }

      // Check if we should start prophets (on Simchat Torah)
      if (!prophetsStarted) {
        const entryDate = new Date(entry.date);
        for (const simchatDate of simchatTorahDates) {
          const simchatDateObj = new Date(simchatDate);

          if (entryDate.getTime() === simchatDateObj.getTime()) {
            prophetsStarted = true;
            console.log(`Starting prophets on ${entry.date} (Simchat Torah)`);
            break;
          }
        }
      }

      // If prophets haven't started yet, skip this entry
      if (!prophetsStarted) {
        entry.prophets = '';
        continue;
      }

      // Assign the current day's reading
      if (currentDayIndex < NEVIIM_SCHEDULE.length) {
        entry.prophets = NEVIIM_SCHEDULE[currentDayIndex].reading;
        currentDayIndex++;
      } else {
        // We've finished the schedule, pause until next Simchat Torah
        entry.prophets = '';
      }

      // Check if we've reached the next Simchat Torah and should restart
      const entryDate = new Date(entry.date);
      for (const simchatDate of simchatTorahDates) {
        const simchatDateObj = new Date(simchatDate);

        if (entryDate.getTime() === simchatDateObj.getTime() && currentDayIndex >= NEVIIM_SCHEDULE.length) {
          currentDayIndex = 0;
          console.log(`Restarting prophets on ${entry.date} (Simchat Torah)`);
          entry.prophets = NEVIIM_SCHEDULE[0].reading;
          currentDayIndex = 1;
        }
      }
    }

    // Update the kriyah file with prophets
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with prophets');

    // Print some sample entries with prophets
    console.log('\nSample entries with prophets:');
    let count = 0;
    for (const entry of sortedEntries) {
      if (entry.prophets && count < 10) {
        console.log(`${entry.date}: ${entry.prophets}${entry.holidayName ? ` (${entry.holidayName})` : ''}`);
        count++;
      } else if (count >= 10) {
        break;
      }
    }

    // Print summary
    let prophetsCount = 0;
    let jonahCount = 0;
    for (const entry of sortedEntries) {
      if (entry.prophets) {
        prophetsCount++;
        if (entry.prophets === 'Jonah') {
          jonahCount++;
        }
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total entries: ${sortedEntries.length}`);
    console.log(`- Entries with prophets: ${prophetsCount}`);
    console.log(`- Jonah readings (Yom Kippur): ${jonahCount}`);

  } catch (error) {
    console.error('Error populating prophets:', error);
    console.error(error.stack);
  }
}

// Run the script
populateProphets();
