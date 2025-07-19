import { KRIYAH } from '../database/kriyah';

/**
 * Fix the database format to use correct API format
 * Changes from: NUM.25.10-18
 * To: NUM.25.10-NUM.25.18
 */
export function fixDatabaseFormat() {
  const updatedKriyah: any = {};
  let updatedCount = 0;

  console.log('🔧 Fixing database format...');

  for (const [id, reading] of Object.entries(KRIYAH)) {
    updatedKriyah[id] = { ...reading };

    // Fix Torah references
    if (reading.torah && typeof reading.torah === 'string') {
      const fixedTorah = fixScriptureReference(reading.torah);
      if (fixedTorah !== reading.torah) {
        updatedKriyah[id].torah = fixedTorah;
        updatedCount++;
        console.log(`Fixed Torah: ${reading.torah} → ${fixedTorah}`);
      }
    }

    // Fix prophets/haftarah references
    if (reading.prophets && typeof reading.prophets === 'string') {
      const fixedProphets = fixScriptureReference(reading.prophets);
      if (fixedProphets !== reading.prophets) {
        updatedKriyah[id].prophets = fixedProphets;
        updatedKriyah[id].haftarah = fixedProphets;
        updatedCount++;
        console.log(`Fixed Prophets: ${reading.prophets} → ${fixedProphets}`);
      }
    }
  }

  console.log(`✅ Fixed ${updatedCount} references`);
  return updatedKriyah;
}

/**
 * Fix a single scripture reference to the correct API format
 */
function fixScriptureReference(reference: string): string {
  // Handle different formats
  if (reference.includes('.')) {
    // Format: NUM.25.10-18 or NUM.25.10-NUM.25.18
    const parts = reference.split('-');
    if (parts.length === 2) {
      const startPart = parts[0]; // NUM.25.10
      const endPart = parts[1];   // 18 or NUM.25.18

      // If end part doesn't have book abbreviation, add it
      if (!endPart.includes('.')) {
        const startParts = startPart.split('.');
        if (startParts.length >= 3) {
          const book = startParts[0];
          const chapter = startParts[1];
          return `${startPart}-${book}.${chapter}.${endPart}`;
        }
      }
    }
  } else if (reference.includes(':')) {
    // Format: Genesis 44:18-34
    const match = reference.match(/^([A-Za-z\s]+)\s+(\d+):(\d+)-(\d+)$/);
    if (match) {
      const [, book, chapter, startVerse, endVerse] = match;
      const abbreviation = getBookAbbreviation(book.trim());
      return `${abbreviation}.${chapter}.${startVerse}-${abbreviation}.${chapter}.${endVerse}`;
    }
  }

  return reference; // Return unchanged if no pattern matches
}

/**
 * Get book abbreviation from full name
 */
function getBookAbbreviation(bookName: string): string {
  const abbreviations: { [key: string]: string } = {
    'Genesis': 'GEN',
    'Exodus': 'EXO',
    'Leviticus': 'LEV',
    'Numbers': 'NUM',
    'Deuteronomy': 'DEU',
    'Joshua': 'JOS',
    'Judges': 'JDG',
    'Ruth': 'RUT',
    '1 Samuel': '1SA',
    '2 Samuel': '2SA',
    '1 Kings': '1KG',
    '2 Kings': '2KG',
    '1 Chronicles': '1CH',
    '2 Chronicles': '2CH',
    'Ezra': 'EZR',
    'Nehemiah': 'NEH',
    'Esther': 'EST',
    'Job': 'JOB',
    'Psalms': 'PSA',
    'Proverbs': 'PRO',
    'Ecclesiastes': 'ECC',
    'Song of Solomon': 'SNG',
    'Isaiah': 'ISA',
    'Jeremiah': 'JER',
    'Lamentations': 'LAM',
    'Ezekiel': 'EZK',
    'Daniel': 'DAN',
    'Hosea': 'HOS',
    'Joel': 'JOL',
    'Amos': 'AMO',
    'Obadiah': 'OBA',
    'Jonah': 'JON',
    'Micah': 'MIC',
    'Nahum': 'NAH',
    'Habakkuk': 'HAB',
    'Zephaniah': 'ZEP',
    'Haggai': 'HAG',
    'Zechariah': 'ZEC',
    'Malachi': 'MAL'
  };

  return abbreviations[bookName] || bookName.toUpperCase().substring(0, 3);
}

// Test the function
if (typeof window === 'undefined') {
  const updated = fixDatabaseFormat();
  console.log('Updated database:', updated);
}
