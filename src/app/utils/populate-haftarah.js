const fs = require('fs');
const path = require('path');

// Traditional Haftarah readings for each parashah
// Note: These may vary by community and year, but hebCal doesn't provide Haftarah data
const HAFTARAH_READINGS = {
  'Bereshit': 'Isaiah 42:5-43:10',
  'Noach': 'Isaiah 54:1-55:5',
  'Lech-Lecha': 'Isaiah 40:27-41:16',
  'Vayera': '2 Kings 4:1-37',
  'Chayei Sara': '1 Kings 1:1-31',
  'Toldot': 'Malachi 1:1-2:7',
  'Vayetzei': 'Hosea 12:13-14:10',
  'Vayishlach': 'Obadiah 1:1-21',
  'Vayeshev': 'Amos 2:6-3:8',
  'Miketz': '1 Kings 3:15-4:1',
  'Vayigash': 'Ezekiel 37:15-28',
  'Vayechi': '1 Kings 2:1-12',
  'Shemot': 'Isaiah 27:6-28:13; 29:22-23',
  'Vaera': 'Ezekiel 28:25-29:21',
  'Bo': 'Jeremiah 46:13-28',
  'Beshalach': 'Judges 4:4-5:31',
  'Yitro': 'Isaiah 6:1-7:6; 9:5-6',
  'Mishpatim': 'Jeremiah 34:8-22; 33:25-26',
  'Terumah': '1 Kings 5:26-6:13',
  'Tetzaveh': 'Ezekiel 43:10-27',
  'Ki Tisa': '1 Kings 18:1-39',
  'Vayakhel': '1 Kings 7:40-50',
  'Pekudei': '1 Kings 7:51-8:21',
  'Vayikra': 'Isaiah 43:21-44:23',
  'Tzav': 'Jeremiah 7:21-8:3; 9:22-23',
  'Shmini': '2 Samuel 6:1-7:17',
  'Tazria': '2 Kings 4:42-5:19',
  'Metzora': '2 Kings 7:3-20',
  'Achrei Mot': 'Ezekiel 22:1-19',
  'Kedoshim': 'Amos 9:7-15',
  'Emor': 'Ezekiel 44:15-31',
  'Behar': 'Jeremiah 32:6-27',
  'Bechukotai': 'Jeremiah 16:19-17:14',
  'Bamidbar': 'Hosea 2:1-22',
  'Nasso': 'Judges 13:2-25',
  'Beha\'alotcha': 'Zechariah 2:14-4:7',
  'Sh\'lach': 'Joshua 2:1-24',
  'Korach': '1 Samuel 11:14-12:22',
  'Chukat': 'Judges 11:1-33',
  'Balak': 'Micah 5:6-6:8',
  'Pinchas': '1 Kings 18:46-19:21',
  'Matot': 'Jeremiah 1:1-2:3',
  'Masei': 'Jeremiah 2:4-28; 3:4',
  'Devarim': 'Isaiah 1:1-27',
  'Vaetchanan': 'Isaiah 40:1-26',
  'Eikev': 'Isaiah 49:14-51:3',
  'Re\'eh': 'Isaiah 54:11-55:5',
  'Shoftim': 'Isaiah 51:12-52:12',
  'Ki Teitzei': 'Isaiah 54:1-10',
  'Ki Tavo': 'Isaiah 60:1-22',
  'Nitzavim': 'Isaiah 61:10-63:9',
  'Vayeilech': 'Hosea 14:2-10; Joel 2:15-27; Micah 7:18-20',
  'Ha\'Azinu': '2 Samuel 22:1-51',
  'Vezot Haberakhah': 'Joshua 1:1-18',
  // Combined parashot
  'Tazria-Metzora': '2 Kings 4:42-5:19',
  'Achrei Mot-Kedoshim': 'Amos 9:7-15',
  'Behar-Bechukotai': 'Jeremiah 16:19-17:14',
  'Matot-Masei': 'Jeremiah 2:4-28; 3:4',
  'Nitzavim-Vayeilech': 'Isaiah 61:10-63:9',
  'Vayakhel-Pekudei': '1 Kings 7:51-8:21'
};

function getDayOfWeek(dateString) {
  const date = new Date(dateString);
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
}

function populateHaftarah() {
  console.log('=== Populating Haftarah Readings (Sabbath Only) ===');

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

    // Sort entries by date to ensure proper order
    const sortedEntries = Object.values(kriyahData).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    let updatedCount = 0;

    // Populate Haftarah readings for Sabbath days only
    for (const entry of sortedEntries) {
      const dayOfWeek = getDayOfWeek(entry.date);

      // Only add Haftarah for Sabbath (Saturday) and only if there's a parashah
      if (dayOfWeek === 6 && entry.parashat && entry.parashat.length > 0) {
        const haftarahReading = HAFTARAH_READINGS[entry.parashat];

        if (haftarahReading) {
          entry.haftarah = haftarahReading;
          updatedCount++;
        } else {
          // Clear Haftarah if no reading found
          entry.haftarah = '';
        }
      } else {
        // Clear Haftarah for non-Sabbath days
        entry.haftarah = '';
      }
    }

    // Update the kriyah file with Haftarah readings
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with Haftarah readings');

    // Print some sample entries
    console.log('\nSample entries with Haftarah readings:');
    let count = 0;
    for (const entry of sortedEntries) {
      if (entry.haftarah && count < 10) {
        const dayOfWeek = getDayOfWeek(entry.date);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        console.log(`${entry.date} (${dayNames[dayOfWeek]}): ${entry.parashat} - ${entry.haftarah}`);
        count++;
      } else if (count >= 10) {
        break;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total entries: ${sortedEntries.length}`);
    console.log(`- Updated entries with Haftarah: ${updatedCount}`);
    console.log(`- Note: Haftarah readings may vary by community and year`);
    console.log(`- hebCal does not provide Haftarah data, using traditional mappings`);

  } catch (error) {
    console.error('Error populating Haftarah readings:', error);
    console.error(error.stack);
  }
}

// Run the script
populateHaftarah();
