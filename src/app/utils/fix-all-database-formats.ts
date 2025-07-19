import { KRIYAH } from '../database/kriyah';
import { DataService } from '../services/data.service';
import { Injectable } from '@angular/core';

/**
 * Fix all scripture references in the database to use correct API format
 * and upload to Firebase
 */
@Injectable({
  providedIn: 'root'
})
export class FixAllDatabaseFormatsService {

  constructor(private dataService: DataService) {}

  /**
   * Fix all scripture references in the database
   */
  fixAllDatabaseFormats(): any {
    const updatedKriyah: any = {};
    let updatedCount = 0;

    console.log('🔧 Fixing all database formats...');

    for (const [id, reading] of Object.entries(KRIYAH)) {
      const readingObj = reading as any;
      updatedKriyah[id] = { ...readingObj };

      // Fix Torah references
      if (readingObj.torah && typeof readingObj.torah === 'string') {
        const fixedTorah = this.fixScriptureReference(readingObj.torah);
        if (fixedTorah !== readingObj.torah) {
          updatedKriyah[id].torah = fixedTorah;
          updatedCount++;
          console.log(`Fixed Torah: ${readingObj.torah} → ${fixedTorah}`);
        }
      }

      // Fix prophets/haftarah references
      if (readingObj.prophets && typeof readingObj.prophets === 'string') {
        const fixedProphets = this.fixScriptureReference(readingObj.prophets);
        if (fixedProphets !== readingObj.prophets) {
          updatedKriyah[id].prophets = fixedProphets;
          updatedKriyah[id].haftarah = fixedProphets;
          updatedCount++;
          console.log(`Fixed Prophets: ${readingObj.prophets} → ${fixedProphets}`);
        }
      }

      // Fix haftarah references
      if (readingObj.haftarah && typeof readingObj.haftarah === 'string') {
        const fixedHaftarah = this.fixScriptureReference(readingObj.haftarah);
        if (fixedHaftarah !== readingObj.haftarah) {
          updatedKriyah[id].haftarah = fixedHaftarah;
          updatedCount++;
          console.log(`Fixed Haftarah: ${readingObj.haftarah} → ${fixedHaftarah}`);
        }
      }
    }

    console.log(`✅ Fixed ${updatedCount} references`);
    return updatedKriyah;
  }

  /**
   * Fix a single scripture reference to the correct API format
   */
  private fixScriptureReference(reference: string): string {
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
      // Format: Genesis 44:18-34 or 1 Kings 18:46-19:21
      const match = reference.match(/^([A-Za-z\s]+)\s+(\d+):(\d+)-(\d+):(\d+)$/);
      if (match) {
        // Cross-chapter format: 1 Kings 18:46-19:21
        const [, book, startChapter, startVerse, endChapter, endVerse] = match;
        const abbreviation = this.getBookAbbreviation(book.trim());
        return `${abbreviation}.${startChapter}.${startVerse}-${abbreviation}.${endChapter}.${endVerse}`;
      } else {
        // Same chapter format: Genesis 44:18-34
        const match2 = reference.match(/^([A-Za-z\s]+)\s+(\d+):(\d+)-(\d+)$/);
        if (match2) {
          const [, book, chapter, startVerse, endVerse] = match2;
          const abbreviation = this.getBookAbbreviation(book.trim());
          return `${abbreviation}.${chapter}.${startVerse}-${abbreviation}.${chapter}.${endVerse}`;
        }
      }
    }

    return reference; // Return unchanged if no pattern matches
  }

  /**
   * Get book abbreviation from full name
   */
  private getBookAbbreviation(bookName: string): string {
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

  /**
   * Upload fixed database to Firebase
   */
  async uploadFixedDatabaseToFirebase(): Promise<void> {
    try {
      console.log('🔄 Starting database format fix and Firebase upload...');

      // Fix all references
      const fixedDatabase = this.fixAllDatabaseFormats();

      // Convert to Firebase format
      const firebaseReadings = Object.values(fixedDatabase).map((reading: any) => ({
        idNo: reading.idNo,
        parashat: reading.parashat,
        parashatHeb: reading.parashatHeb,
        parashatEng: reading.parashatEng,
        date: reading.date,
        holiday: reading.holiday,
        holidayReadings: reading.holidayReadings,
        holidayDate: reading.holidayDate,
        kriyah: reading.kriyah,
        kriyahHeb: reading.kriyahHeb,
        kriyahEng: reading.kriyahEng,
        kriyahDate: reading.kriyahDate,
        torah: reading.torah,
        prophets: reading.prophets,
        writings: reading.writings,
        britChadashah: reading.britChadashah,
        haftarah: reading.haftarah,
        apostles: reading.apostles
      }));

      console.log(`📤 Uploading ${firebaseReadings.length} fixed readings to Firebase...`);

      // First, delete the existing 'readings' collection
      console.log('🗑️ Deleting existing readings collection...');
      await this.dataService.clearReadingsCollection();
      console.log('✅ Existing readings collection deleted');

      // Upload to Firebase
      await this.dataService.addReadings(firebaseReadings);

      console.log('✅ Successfully uploaded fixed database to Firebase!');

    } catch (error) {
      console.error('❌ Error uploading fixed database to Firebase:', error);
      throw error;
    }
  }
}
