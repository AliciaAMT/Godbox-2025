import { ParashahService } from '../services/parashah.service';

export async function updateKriyahDatabase() {
  const parashahService = new ParashahService();

  // Generate readings for current year
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01`);
  const endDate = new Date(`${currentYear + 1}-01-01`);

  console.log(`Generating readings for ${currentYear}...`);

  const readings = parashahService.generateReadings(startDate, endDate);
  const databaseContent = parashahService.generateDatabaseFile(readings);

  console.log(`Generated ${readings.length} readings for ${currentYear}`);
  console.log('Database content preview:');
  console.log(databaseContent.substring(0, 500) + '...');

  return {
    readings,
    databaseContent,
    year: currentYear,
    count: readings.length
  };
}

// Instructions for manual file replacement
export const REPLACEMENT_INSTRUCTIONS = `
To update your database file:

1. Copy the generated code from the clipboard
2. Open your file: src/app/database/kriyah.ts
3. Replace the entire content with the new code
4. Save the file
5. Restart your development server

The new database will contain ${new Date().getFullYear()} readings with:
- Automated parashat detection using hebCal
- Hebrew and English translations
- Proper date formatting
- Daily kriyah numbering (1-7)
- Empty fields for manual completion (torah, prophets, etc.)
`;
