import { Injectable } from '@angular/core';

export interface ScriptureReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  reference: string; // Formatted for api.bible
}

export interface DailyReadings {
  torah: ScriptureReference;
  prophets?: ScriptureReference;
  writings?: ScriptureReference;
  britChadashah?: ScriptureReference;
}

@Injectable({
  providedIn: 'root'
})
export class ScriptureMappingService {

  // Comprehensive mapping of parashot to daily readings with proper Bible API abbreviations
  private readonly parashahReadings: { [key: string]: DailyReadings[] } = {
    'Bereshit': [
      { torah: { book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 5, reference: 'Gen 1:1-5' } },
      { torah: { book: 'Genesis', chapter: 1, verseStart: 6, verseEnd: 8, reference: 'Gen 1:6-8' } },
      { torah: { book: 'Genesis', chapter: 1, verseStart: 9, verseEnd: 13, reference: 'Gen 1:9-13' } },
      { torah: { book: 'Genesis', chapter: 1, verseStart: 14, verseEnd: 19, reference: 'Gen 1:14-19' } },
      { torah: { book: 'Genesis', chapter: 1, verseStart: 20, verseEnd: 23, reference: 'Gen 1:20-23' } },
      { torah: { book: 'Genesis', chapter: 1, verseStart: 24, verseEnd: 31, reference: 'Gen 1:24-31' } },
      {
        torah: { book: 'Genesis', chapter: 2, verseStart: 1, verseEnd: 3, reference: 'Gen 2:1-3' },
        prophets: { book: 'Isaiah', chapter: 42, verseStart: 5, verseEnd: 21, reference: 'Isa 42:5-21' }
      }
    ],
    'Noach': [
      { torah: { book: 'Genesis', chapter: 6, verseStart: 9, verseEnd: 22, reference: 'Gen 6:9-22' } },
      { torah: { book: 'Genesis', chapter: 7, verseStart: 1, verseEnd: 16, reference: 'Gen 7:1-16' } },
      { torah: { book: 'Genesis', chapter: 7, verseStart: 17, verseEnd: 23, reference: 'Gen 7:17-23' } },
      { torah: { book: 'Genesis', chapter: 7, verseStart: 24, verseEnd: 8, reference: 'Gen 7:24-8:4' } },
      { torah: { book: 'Genesis', chapter: 8, verseStart: 5, verseEnd: 14, reference: 'Gen 8:5-14' } },
      { torah: { book: 'Genesis', chapter: 8, verseStart: 15, verseEnd: 22, reference: 'Gen 8:15-22' } },
      {
        torah: { book: 'Genesis', chapter: 9, verseStart: 1, verseEnd: 7, reference: 'Gen 9:1-7' },
        prophets: { book: 'Isaiah', chapter: 54, verseStart: 9, verseEnd: 10, reference: 'Isa 54:9-10' }
      }
    ],
    'Lech Lecha': [
      { torah: { book: 'Genesis', chapter: 12, verseStart: 1, verseEnd: 9, reference: 'Genesis 12:1-9' } },
      { torah: { book: 'Genesis', chapter: 12, verseStart: 10, verseEnd: 20, reference: 'Genesis 12:10-20' } },
      { torah: { book: 'Genesis', chapter: 13, verseStart: 1, verseEnd: 18, reference: 'Genesis 13:1-18' } },
      { torah: { book: 'Genesis', chapter: 14, verseStart: 1, verseEnd: 20, reference: 'Genesis 14:1-20' } },
      { torah: { book: 'Genesis', chapter: 14, verseStart: 21, verseEnd: 24, reference: 'Genesis 14:21-24' } },
      { torah: { book: 'Genesis', chapter: 15, verseStart: 1, verseEnd: 11, reference: 'Genesis 15:1-11' } },
      {
        torah: { book: 'Genesis', chapter: 15, verseStart: 12, verseEnd: 21, reference: 'Genesis 15:12-21' },
        prophets: { book: 'Isaiah', chapter: 40, verseStart: 27, verseEnd: 41, reference: 'Isaiah 40:27-41' }
      }
    ],
    'Vayera': [
      { torah: { book: 'Genesis', chapter: 18, verseStart: 1, verseEnd: 14, reference: 'Genesis 18:1-14' } },
      { torah: { book: 'Genesis', chapter: 18, verseStart: 15, verseEnd: 33, reference: 'Genesis 18:15-33' } },
      { torah: { book: 'Genesis', chapter: 19, verseStart: 1, verseEnd: 20, reference: 'Genesis 19:1-20' } },
      { torah: { book: 'Genesis', chapter: 19, verseStart: 21, verseEnd: 38, reference: 'Genesis 19:21-38' } },
      { torah: { book: 'Genesis', chapter: 20, verseStart: 1, verseEnd: 18, reference: 'Genesis 20:1-18' } },
      { torah: { book: 'Genesis', chapter: 21, verseStart: 1, verseEnd: 21, reference: 'Genesis 21:1-21' } },
      {
        torah: { book: 'Genesis', chapter: 21, verseStart: 22, verseEnd: 34, reference: 'Genesis 21:22-34' },
        prophets: { book: '2 Kings', chapter: 4, verseStart: 1, verseEnd: 37, reference: '2 Kings 4:1-37' }
      }
    ],
    'Chayei Sarah': [
      { torah: { book: 'Genesis', chapter: 23, verseStart: 1, verseEnd: 20, reference: 'Genesis 23:1-20' } },
      { torah: { book: 'Genesis', chapter: 24, verseStart: 1, verseEnd: 27, reference: 'Genesis 24:1-27' } },
      { torah: { book: 'Genesis', chapter: 24, verseStart: 28, verseEnd: 52, reference: 'Genesis 24:28-52' } },
      { torah: { book: 'Genesis', chapter: 24, verseStart: 53, verseEnd: 67, reference: 'Genesis 24:53-67' } },
      { torah: { book: 'Genesis', chapter: 25, verseStart: 1, verseEnd: 11, reference: 'Genesis 25:1-11' } },
      { torah: { book: 'Genesis', chapter: 25, verseStart: 12, verseEnd: 18, reference: 'Genesis 25:12-18' } },
      {
        torah: { book: 'Genesis', chapter: 25, verseStart: 19, verseEnd: 34, reference: 'Genesis 25:19-34' },
        prophets: { book: '1 Kings', chapter: 1, verseStart: 1, verseEnd: 31, reference: '1 Kings 1:1-31' }
      }
    ],
    'Toldot': [
      { torah: { book: 'Genesis', chapter: 25, verseStart: 19, verseEnd: 26, reference: 'Genesis 25:19-26' } },
      { torah: { book: 'Genesis', chapter: 25, verseStart: 27, verseEnd: 34, reference: 'Genesis 25:27-34' } },
      { torah: { book: 'Genesis', chapter: 26, verseStart: 1, verseEnd: 12, reference: 'Genesis 26:1-12' } },
      { torah: { book: 'Genesis', chapter: 26, verseStart: 13, verseEnd: 22, reference: 'Genesis 26:13-22' } },
      { torah: { book: 'Genesis', chapter: 26, verseStart: 23, verseEnd: 33, reference: 'Genesis 26:23-33' } },
      { torah: { book: 'Genesis', chapter: 26, verseStart: 34, verseEnd: 35, reference: 'Genesis 26:34-35' } },
      {
        torah: { book: 'Genesis', chapter: 27, verseStart: 1, verseEnd: 27, reference: 'Genesis 27:1-27' },
        prophets: { book: 'Malachi', chapter: 1, verseStart: 1, verseEnd: 14, reference: 'Malachi 1:1-14' }
      }
    ],
    'Vayetze': [
      { torah: { book: 'Genesis', chapter: 28, verseStart: 10, verseEnd: 22, reference: 'Genesis 28:10-22' } },
      { torah: { book: 'Genesis', chapter: 29, verseStart: 1, verseEnd: 17, reference: 'Genesis 29:1-17' } },
      { torah: { book: 'Genesis', chapter: 29, verseStart: 18, verseEnd: 30, reference: 'Genesis 29:18-30' } },
      { torah: { book: 'Genesis', chapter: 29, verseStart: 31, verseEnd: 35, reference: 'Genesis 29:31-35' } },
      { torah: { book: 'Genesis', chapter: 30, verseStart: 1, verseEnd: 13, reference: 'Genesis 30:1-13' } },
      { torah: { book: 'Genesis', chapter: 30, verseStart: 14, verseEnd: 27, reference: 'Genesis 30:14-27' } },
      {
        torah: { book: 'Genesis', chapter: 30, verseStart: 28, verseEnd: 43, reference: 'Genesis 30:28-43' },
        prophets: { book: 'Hosea', chapter: 12, verseStart: 12, verseEnd: 14, reference: 'Hosea 12:12-14' }
      }
    ],
    'Vayishlach': [
      { torah: { book: 'Genesis', chapter: 32, verseStart: 4, verseEnd: 13, reference: 'Genesis 32:4-13' } },
      { torah: { book: 'Genesis', chapter: 32, verseStart: 14, verseEnd: 30, reference: 'Genesis 32:14-30' } },
      { torah: { book: 'Genesis', chapter: 32, verseStart: 31, verseEnd: 33, reference: 'Genesis 32:31-33' } },
      { torah: { book: 'Genesis', chapter: 33, verseStart: 1, verseEnd: 16, reference: 'Genesis 33:1-16' } },
      { torah: { book: 'Genesis', chapter: 33, verseStart: 17, verseEnd: 20, reference: 'Genesis 33:17-20' } },
      { torah: { book: 'Genesis', chapter: 34, verseStart: 1, verseEnd: 12, reference: 'Genesis 34:1-12' } },
      {
        torah: { book: 'Genesis', chapter: 34, verseStart: 13, verseEnd: 31, reference: 'Genesis 34:13-31' },
        prophets: { book: 'Obadiah', chapter: 1, verseStart: 1, verseEnd: 21, reference: 'Obadiah 1:1-21' }
      }
    ],
    'Vayeshev': [
      { torah: { book: 'Genesis', chapter: 37, verseStart: 1, verseEnd: 11, reference: 'Genesis 37:1-11' } },
      { torah: { book: 'Genesis', chapter: 37, verseStart: 12, verseEnd: 22, reference: 'Genesis 37:12-22' } },
      { torah: { book: 'Genesis', chapter: 37, verseStart: 23, verseEnd: 36, reference: 'Genesis 37:23-36' } },
      { torah: { book: 'Genesis', chapter: 38, verseStart: 1, verseEnd: 11, reference: 'Genesis 38:1-11' } },
      { torah: { book: 'Genesis', chapter: 38, verseStart: 12, verseEnd: 23, reference: 'Genesis 38:12-23' } },
      { torah: { book: 'Genesis', chapter: 38, verseStart: 24, verseEnd: 30, reference: 'Genesis 38:24-30' } },
      {
        torah: { book: 'Genesis', chapter: 39, verseStart: 1, verseEnd: 6, reference: 'Genesis 39:1-6' },
        prophets: { book: 'Amos', chapter: 2, verseStart: 6, verseEnd: 3, reference: 'Amos 2:6-3:8' }
      }
    ],
    'Miketz': [
      { torah: { book: 'Genesis', chapter: 41, verseStart: 1, verseEnd: 14, reference: 'Genesis 41:1-14' } },
      { torah: { book: 'Genesis', chapter: 41, verseStart: 15, verseEnd: 38, reference: 'Genesis 41:15-38' } },
      { torah: { book: 'Genesis', chapter: 41, verseStart: 39, verseEnd: 52, reference: 'Genesis 41:39-52' } },
      { torah: { book: 'Genesis', chapter: 41, verseStart: 53, verseEnd: 57, reference: 'Genesis 41:53-57' } },
      { torah: { book: 'Genesis', chapter: 42, verseStart: 1, verseEnd: 17, reference: 'Genesis 42:1-17' } },
      { torah: { book: 'Genesis', chapter: 42, verseStart: 18, verseEnd: 26, reference: 'Genesis 42:18-26' } },
      {
        torah: { book: 'Genesis', chapter: 42, verseStart: 27, verseEnd: 38, reference: 'Genesis 42:27-38' },
        prophets: { book: '1 Kings', chapter: 3, verseStart: 15, verseEnd: 28, reference: '1 Kings 3:15-28' }
      }
    ],
    'Vayigash': [
      { torah: { book: 'Genesis', chapter: 44, verseStart: 18, verseEnd: 34, reference: 'Genesis 44:18-34' } },
      { torah: { book: 'Genesis', chapter: 45, verseStart: 1, verseEnd: 16, reference: 'Genesis 45:1-16' } },
      { torah: { book: 'Genesis', chapter: 45, verseStart: 17, verseEnd: 27, reference: 'Genesis 45:17-27' } },
      { torah: { book: 'Genesis', chapter: 45, verseStart: 28, verseEnd: 46, reference: 'Genesis 45:28-46:7' } },
      { torah: { book: 'Genesis', chapter: 46, verseStart: 8, verseEnd: 27, reference: 'Genesis 46:8-27' } },
      { torah: { book: 'Genesis', chapter: 46, verseStart: 28, verseEnd: 34, reference: 'Genesis 46:28-34' } },
      {
        torah: { book: 'Genesis', chapter: 47, verseStart: 1, verseEnd: 10, reference: 'Genesis 47:1-10' },
        prophets: { book: 'Ezekiel', chapter: 37, verseStart: 15, verseEnd: 28, reference: 'Ezekiel 37:15-28' }
      }
    ],
    'Vayechi': [
      { torah: { book: 'Genesis', chapter: 47, verseStart: 28, verseEnd: 31, reference: 'Genesis 47:28-31' } },
      { torah: { book: 'Genesis', chapter: 48, verseStart: 1, verseEnd: 9, reference: 'Genesis 48:1-9' } },
      { torah: { book: 'Genesis', chapter: 48, verseStart: 10, verseEnd: 16, reference: 'Genesis 48:10-16' } },
      { torah: { book: 'Genesis', chapter: 48, verseStart: 17, verseEnd: 22, reference: 'Genesis 48:17-22' } },
      { torah: { book: 'Genesis', chapter: 49, verseStart: 1, verseEnd: 18, reference: 'Genesis 49:1-18' } },
      { torah: { book: 'Genesis', chapter: 49, verseStart: 19, verseEnd: 26, reference: 'Genesis 49:19-26' } },
      {
        torah: { book: 'Genesis', chapter: 49, verseStart: 27, verseEnd: 33, reference: 'Genesis 49:27-33' },
        prophets: { book: '1 Kings', chapter: 2, verseStart: 1, verseEnd: 12, reference: '1 Kings 2:1-12' }
      }
    ],
    'Pinchas': [
      { torah: { book: 'Numbers', chapter: 25, verseStart: 10, verseEnd: 18, reference: 'NUM.25.10-NUM.25.18' } },
      { torah: { book: 'Numbers', chapter: 26, verseStart: 1, verseEnd: 11, reference: 'NUM.26.1-NUM.26.11' } },
      { torah: { book: 'Numbers', chapter: 26, verseStart: 12, verseEnd: 34, reference: 'NUM.26.12-NUM.26.34' } },
      { torah: { book: 'Numbers', chapter: 26, verseStart: 35, verseEnd: 51, reference: 'NUM.26.35-NUM.26.51' } },
      { torah: { book: 'Numbers', chapter: 26, verseStart: 52, verseEnd: 65, reference: 'NUM.26.52-NUM.26.65' } },
      { torah: { book: 'Numbers', chapter: 27, verseStart: 1, verseEnd: 11, reference: 'NUM.27.1-NUM.27.11' } },
      {
        torah: { book: 'Numbers', chapter: 27, verseStart: 12, verseEnd: 23, reference: 'NUM.27.12-NUM.27.23' },
        prophets: { book: '1 Kings', chapter: 18, verseStart: 46, verseEnd: 19021, reference: '1KG.18.46-1KG.19.21' }
      }
    ]
  };

  constructor() { }

  /**
   * Get scripture references for a specific parashah and daily reading
   */
  getScriptureReferences(parashah: string, dayNumber: number): DailyReadings | null {
    const readings = this.parashahReadings[parashah];
    if (!readings || dayNumber < 1 || dayNumber > readings.length) {
      return null;
    }
    return readings[dayNumber - 1];
  }

  /**
   * Format scripture reference in the correct api.bible format
   * Format: BOOKABBREVIATION.CHAPTER.STARTINGVERSE-BOOKABBREVIATION.CHAPTER.ENDVERSE
   */
  formatScriptureReference(book: string, chapter: number, verseStart: number, verseEnd: number): string {
    // Map book names to abbreviations
    const bookAbbreviations: { [key: string]: string } = {
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
      'Malachi': 'MAL',
      'Matthew': 'MAT',
      'Mark': 'MRK',
      'Luke': 'LUK',
      'John': 'JHN',
      'Acts': 'ACT',
      'Romans': 'ROM',
      '1 Corinthians': '1CO',
      '2 Corinthians': '2CO',
      'Galatians': 'GAL',
      'Ephesians': 'EPH',
      'Philippians': 'PHP',
      'Colossians': 'COL',
      '1 Thessalonians': '1TH',
      '2 Thessalonians': '2TH',
      '1 Timothy': '1TI',
      '2 Timothy': '2TI',
      'Titus': 'TIT',
      'Philemon': 'PHM',
      'Hebrews': 'HEB',
      'James': 'JAS',
      '1 Peter': '1PE',
      '2 Peter': '2PE',
      '1 John': '1JN',
      '2 John': '2JN',
      '3 John': '3JN',
      'Jude': 'JUD',
      'Revelation': 'REV'
    };

    const abbreviation = bookAbbreviations[book] || book.toUpperCase().substring(0, 3);

    // Handle cross-chapter references (like 1 Kings 18:46-19:21)
    if (verseEnd > 1000) {
      // This indicates a cross-chapter reference
      const endChapter = Math.floor(verseEnd / 1000);
      const endVerse = verseEnd % 1000;
      return `${abbreviation}.${chapter}.${verseStart}-${abbreviation}.${endChapter}.${endVerse}`;
    }

    // Same chapter reference
    if (verseEnd <= verseStart) {
      return `${abbreviation}.${chapter}.${verseStart}`;
    }

    return `${abbreviation}.${chapter}.${verseStart}-${abbreviation}.${chapter}.${verseEnd}`;
  }

  /**
   * Get formatted scripture reference for api.bible
   */
  getFormattedReference(scripture: ScriptureReference): string {
    return this.formatScriptureReference(scripture.book, scripture.chapter, scripture.verseStart, scripture.verseEnd);
  }

  /**
   * Get all available parashot
   */
  getAvailableParashot(): string[] {
    return Object.keys(this.parashahReadings);
  }

  /**
   * Check if a parashah has complete readings
   */
  hasCompleteReadings(parashah: string): boolean {
    const readings = this.parashahReadings[parashah];
    return readings && readings.length === 7;
  }
}
