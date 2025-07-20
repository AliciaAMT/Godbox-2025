const fs = require('fs');
const path = require('path');

// Traditional Torah readings for each parashah
const TORAH_READINGS = {
  'Bereshit': 'Genesis 1:1-6:8',
  'Noach': 'Genesis 6:9-11:32',
  'Lech-Lecha': 'Genesis 12:1-17:27',
  'Vayera': 'Genesis 18:1-22:24',
  'Chayei Sara': 'Genesis 23:1-25:18',
  'Toldot': 'Genesis 25:19-28:9',
  'Vayetzei': 'Genesis 28:10-32:3',
  'Vayishlach': 'Genesis 32:4-36:43',
  'Vayeshev': 'Genesis 37:1-40:23',
  'Miketz': 'Genesis 41:1-44:17',
  'Vayigash': 'Genesis 44:18-47:27',
  'Vayechi': 'Genesis 47:28-50:26',
  'Shemot': 'Exodus 1:1-6:1',
  'Vaera': 'Exodus 6:2-9:35',
  'Bo': 'Exodus 10:1-13:16',
  'Beshalach': 'Exodus 13:17-17:16',
  'Yitro': 'Exodus 18:1-20:23',
  'Mishpatim': 'Exodus 21:1-24:18',
  'Terumah': 'Exodus 25:1-27:19',
  'Tetzaveh': 'Exodus 27:20-30:10',
  'Ki Tisa': 'Exodus 30:11-34:35',
  'Vayakhel': 'Exodus 35:1-38:20',
  'Pekudei': 'Exodus 38:21-40:38',
  'Vayikra': 'Leviticus 1:1-5:26',
  'Tzav': 'Leviticus 6:1-8:36',
  'Shmini': 'Leviticus 9:1-11:47',
  'Tazria': 'Leviticus 12:1-13:59',
  'Metzora': 'Leviticus 14:1-15:33',
  'Achrei Mot': 'Leviticus 16:1-18:30',
  'Kedoshim': 'Leviticus 19:1-20:27',
  'Emor': 'Leviticus 21:1-24:23',
  'Behar': 'Leviticus 25:1-26:2',
  'Bechukotai': 'Leviticus 26:3-27:34',
  'Bamidbar': 'Numbers 1:1-4:20',
  'Nasso': 'Numbers 4:21-7:89',
  'Beha\'alotcha': 'Numbers 8:1-12:16',
  'Sh\'lach': 'Numbers 13:1-15:41',
  'Korach': 'Numbers 16:1-18:32',
  'Chukat': 'Numbers 19:1-22:1',
  'Balak': 'Numbers 22:2-25:9',
  'Pinchas': 'Numbers 25:10-30:1',
  'Matot': 'Numbers 30:2-32:42',
  'Masei': 'Numbers 33:1-36:13',
  'Devarim': 'Deuteronomy 1:1-3:22',
  'Vaetchanan': 'Deuteronomy 3:23-7:11',
  'Eikev': 'Deuteronomy 7:12-11:25',
  'Re\'eh': 'Deuteronomy 11:26-16:17',
  'Shoftim': 'Deuteronomy 16:18-21:9',
  'Ki Teitzei': 'Deuteronomy 21:10-25:19',
  'Ki Tavo': 'Deuteronomy 26:1-29:8',
  'Nitzavim': 'Deuteronomy 29:9-30:20',
  'Vayeilech': 'Deuteronomy 31:1-31:30',
  'Ha\'Azinu': 'Deuteronomy 32:1-32:52',
  'Vezot Haberakhah': 'Deuteronomy 33:1-34:12'
};

// Traditional Haftarah readings for each parashah
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
  'Vezot Haberakhah': 'Joshua 1:1-18'
};

function populateTorahHaftarah() {
  console.log('=== Populating Torah and Haftarah Readings ===');

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

    let torahCount = 0;
    let haftarahCount = 0;

    // Populate Torah and Haftarah readings
    for (const entry of sortedEntries) {
      // Only populate for entries that have a parashat (Sabbath readings)
      if (entry.parashat && entry.parashat.length > 0) {
        const torahReading = TORAH_READINGS[entry.parashat];
        const haftarahReading = HAFTARAH_READINGS[entry.parashat];

        if (torahReading) {
          entry.torah = torahReading;
          torahCount++;
        }

        if (haftarahReading) {
          entry.haftarah = haftarahReading;
          haftarahCount++;
        }
      } else {
        // Clear Torah and Haftarah for non-Sabbath days
        entry.torah = '';
        entry.haftarah = '';
      }
    }

    // Update the kriyah file with Torah and Haftarah
    const updatedContent = content.replace(
      /export const KRIYAH: any = {[\s\S]*};/,
      `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
    );

    fs.writeFileSync(kriyahPath, updatedContent);
    console.log('Successfully updated kriyah.ts file with Torah and Haftarah');

    // Print some sample entries with Torah and Haftarah
    console.log('\nSample entries with Torah and Haftarah:');
    let count = 0;
    for (const entry of sortedEntries) {
      if (entry.torah && count < 10) {
        console.log(`${entry.date}: ${entry.parashat}`);
        console.log(`  Torah: ${entry.torah}`);
        console.log(`  Haftarah: ${entry.haftarah}`);
        count++;
      } else if (count >= 10) {
        break;
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Total entries: ${sortedEntries.length}`);
    console.log(`- Torah readings: ${torahCount}`);
    console.log(`- Haftarah readings: ${haftarahCount}`);

  } catch (error) {
    console.error('Error populating Torah and Haftarah:', error);
    console.error(error.stack);
  }
}

// Run the script
populateTorahHaftarah();
