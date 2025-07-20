import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ESVPassage {
  reference: string;
  text: string;
  verses: ESVVerse[];
  content?: string;
}

export interface ESVVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface ESVApiResponse {
  query: string;
  canonical: string;
  parsed: number[][];
  passage_meta: {
    chapter_start: number[];
    chapter_end: number[];
    prev_verse: number;
    next_verse: number;
    prev_chapter: number[];
    next_chapter: number[];
  };
  passages: string[];
  html: string;
}

@Injectable({
  providedIn: 'root'
})
export class ESVApiService {
  private readonly baseUrl = 'https://api.esv.org/v3/passage/html';

  constructor(private http: HttpClient) { }

  /**
   * Get a passage from ESV API
   */
  getPassage(reference: string): Observable<ESVPassage | null> {
    const apiKey = environment.esvBible?.apiKey;

    if (!apiKey) {
      console.log('❌ No ESV API key configured');
      return from(Promise.resolve(null));
    }

    console.log('🔍 Original reference:', reference);
    const formattedReference = this.formatReferenceForESV(reference);
    console.log('🔍 Formatted reference for ESV:', formattedReference);

    if (!formattedReference) {
      console.error('Invalid reference format for ESV:', reference);
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${apiKey}`
    });

    const params: Record<string, string> = {
      q: formattedReference || '',
      'include-passage-references': 'true',
      'include-verse-numbers': 'true',
      'include-first-verse-numbers': 'true',
      'include-footnotes': 'false',
      'include-headings': 'false',
      'include-subheadings': 'false',
      'include-audio-link': 'false'
    };

    const url = `${this.baseUrl}`;
    console.log('🔍 Fetching ESV passage:', url, 'with params:', params);

    return this.http.get<ESVApiResponse>(url, { headers, params }).pipe(
      map(response => {
        console.log('🔍 ESV API raw response:', response);

        // ESV API returns passages array, not html
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ ESV API returned passages');
          const passageText = response.passages[0];

          return {
            reference: response.canonical || reference,
            text: this.extractTextFromHTML(passageText),
            verses: this.parseVersesFromHTML(passageText, response.parsed),
            content: this.formatContentWithSuperscript(passageText)
          };
        } else {
          console.log('❌ ESV API returned no passages');
          console.log('Response structure:', JSON.stringify(response, null, 2));
          return null;
        }
      }),
      catchError(error => {
        console.error('❌ Error fetching ESV passage:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: url,
          params: params
        });
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Get a single verse from ESV API
   */
  getVerse(reference: string): Observable<ESVVerse | null> {
    return this.getPassage(reference).pipe(
      map(passage => {
        if (passage && passage.verses.length > 0) {
          return passage.verses[0];
        }
        return null;
      })
    );
  }

  /**
   * Search for verses in ESV
   */
  searchVerses(query: string): Observable<ESVVerse[]> {
    const apiKey = environment.esvBible?.apiKey;

    if (!apiKey) {
      return from(Promise.resolve([]));
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${apiKey}`
    });

    const params: Record<string, string> = {
      q: query || '',
      'include-passage-references': 'true',
      'include-verse-numbers': 'true',
      'include-first-verse-numbers': 'true',
      'include-footnotes': 'false',
      'include-headings': 'false',
      'include-subheadings': 'false',
      'include-audio-link': 'false'
    };

    const url = `${this.baseUrl}`;

    return this.http.get<ESVApiResponse>(url, { headers, params }).pipe(
      map(response => {
        if (response && response.passages && response.passages.length > 0) {
          return this.parseVersesFromHTML(response.passages[0], response.parsed);
        }
        return [];
      }),
      catchError(error => {
        console.error('Error searching ESV verses:', error);
        return from(Promise.resolve([]));
      })
    );
  }

  /**
   * Format reference for ESV API
   */
  private formatReferenceForESV(reference: string): string | null {
    // ESV API uses standard Bible reference format
    // Examples: "John 3:16", "Genesis 1:1-5", "Matthew 5:1-12"

    // Clean up the reference
    let cleaned = reference.trim();

    // Handle Bible API style references (e.g., "MAT.1.1-MAT.1.10")
    if (cleaned.includes('.')) {
      const parts = cleaned.split('-');
      if (parts.length === 2) {
        const startPart = parts[0];
        const endPart = parts[1];

        // Parse start reference
        const startMatch = startPart.match(/^([A-Z]+)\.(\d+)\.(\d+)$/);
        const endMatch = endPart.match(/^([A-Z]+)\.(\d+)\.(\d+)$/);

        if (startMatch && endMatch) {
          const startBook = this.convertBookAbbreviation(startMatch[1]);
          const startChapter = parseInt(startMatch[2]);
          const startVerse = parseInt(startMatch[3]);

          const endBook = this.convertBookAbbreviation(endMatch[1]);
          const endChapter = parseInt(endMatch[2]);
          const endVerse = parseInt(endMatch[3]);

          if (startBook && endBook && startBook === endBook) {
            if (startChapter === endChapter) {
              // Same chapter, different verses
              return `${startBook} ${startChapter}:${startVerse}-${endVerse}`;
            } else {
              // Different chapters
              return `${startBook} ${startChapter}:${startVerse}-${endChapter}:${endVerse}`;
            }
          }
        }
      }
    }

    // Handle common abbreviations
    const bookMappings: { [key: string]: string } = {
      'Gen': 'Genesis',
      'Exo': 'Exodus',
      'Lev': 'Leviticus',
      'Num': 'Numbers',
      'Deut': 'Deuteronomy',
      'Jos': 'Joshua',
      'Judg': 'Judges',
      'Ruth': 'Ruth',
      '1Sam': '1 Samuel',
      '2Sam': '2 Samuel',
      '1Kgs': '1 Kings',
      '2Kgs': '2 Kings',
      '1Chr': '1 Chronicles',
      '2Chr': '2 Chronicles',
      'Ezra': 'Ezra',
      'Neh': 'Nehemiah',
      'Esth': 'Esther',
      'Job': 'Job',
      'Ps': 'Psalms',
      'Prov': 'Proverbs',
      'Eccl': 'Ecclesiastes',
      'Song': 'Song of Solomon',
      'Isa': 'Isaiah',
      'Jer': 'Jeremiah',
      'Lam': 'Lamentations',
      'Ezek': 'Ezekiel',
      'Dan': 'Daniel',
      'Hos': 'Hosea',
      'Joel': 'Joel',
      'Amos': 'Amos',
      'Obad': 'Obadiah',
      'Jonah': 'Jonah',
      'Micah': 'Micah',
      'Nah': 'Nahum',
      'Hab': 'Habakkuk',
      'Zeph': 'Zephaniah',
      'Hag': 'Haggai',
      'Zech': 'Zechariah',
      'Mal': 'Malachi',
      'Matt': 'Matthew',
      'Mark': 'Mark',
      'Luke': 'Luke',
      'John': 'John',
      'Acts': 'Acts',
      'Rom': 'Romans',
      '1Cor': '1 Corinthians',
      '2Cor': '2 Corinthians',
      'Gal': 'Galatians',
      'Eph': 'Ephesians',
      'Phil': 'Philippians',
      'Col': 'Colossians',
      '1Thess': '1 Thessalonians',
      '2Thess': '2 Thessalonians',
      '1Tim': '1 Timothy',
      '2Tim': '2 Timothy',
      'Titus': 'Titus',
      'Phlm': 'Philemon',
      'Heb': 'Hebrews',
      'Jas': 'James',
      '1Pet': '1 Peter',
      '2Pet': '2 Peter',
      '1John': '1 John',
      '2John': '2 John',
      '3John': '3 John',
      'Jude': 'Jude',
      'Rev': 'Revelation'
    };

    // Replace abbreviations with full names
    for (const [abbr, fullName] of Object.entries(bookMappings)) {
      const regex = new RegExp(`^${abbr}\\s`, 'i');
      if (regex.test(cleaned)) {
        cleaned = cleaned.replace(regex, `${fullName} `);
        break;
      }
    }

    // Handle chapter-only references (e.g., "Matthew 9")
    const chapterOnlyMatch = cleaned.match(/^([A-Za-z\s]+)\s+(\d+)$/);
    if (chapterOnlyMatch) {
      const bookName = chapterOnlyMatch[1].trim();
      const chapter = parseInt(chapterOnlyMatch[2]);

      // Get verse count for this chapter
      const verseCount = this.getVerseCountForChapter(bookName, chapter);

      if (verseCount > 0) {
        // ESV API prefers "Matthew 9:1-38" format for full chapters
        return `${bookName} ${chapter}:1-${verseCount}`;
      } else {
        // If we don't have verse count, try just the chapter
        return `${bookName} ${chapter}`;
      }
    }

    // Handle verse ranges (e.g., "Matthew 9:1-10")
    const verseRangeMatch = cleaned.match(/^([A-Za-z\s]+)\s+(\d+):(\d+)-(\d+)$/);
    if (verseRangeMatch) {
      const bookName = verseRangeMatch[1].trim();
      const chapter = parseInt(verseRangeMatch[2]);
      const startVerse = parseInt(verseRangeMatch[3]);
      const endVerse = parseInt(verseRangeMatch[4]);

      return `${bookName} ${chapter}:${startVerse}-${endVerse}`;
    }

    // Handle single verses (e.g., "Matthew 9:1")
    const singleVerseMatch = cleaned.match(/^([A-Za-z\s]+)\s+(\d+):(\d+)$/);
    if (singleVerseMatch) {
      const bookName = singleVerseMatch[1].trim();
      const chapter = parseInt(singleVerseMatch[2]);
      const verse = parseInt(singleVerseMatch[3]);

      return `${bookName} ${chapter}:${verse}`;
    }

    // If no patterns match, return the cleaned reference
    return cleaned;
  }

    /**
   * Extract plain text from HTML content
   */
  private extractTextFromHTML(html: string): string {
    // Remove HTML tags but keep the text content
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  /**
   * Parse verses from ESV API response HTML
   */
  private parseVersesFromHTML(html: string, parsed: number[][]): ESVVerse[] {
    const verses: ESVVerse[] = [];

    // ESV API returns HTML with verse numbers in <span class="v"> tags
    // We need to parse this to extract individual verses
    const verseMatches = html.match(/<span[^>]*class="v"[^>]*>(\d+)<\/span>/g);

    if (verseMatches && parsed && parsed.length > 0) {
      const firstVerse = parsed[0];
      let book = 'Unknown';
      let chapter = 1;

      if (firstVerse.length >= 2) {
        book = this.getBookNameFromNumber(firstVerse[0]);
        chapter = firstVerse[1];
      }

      // Extract verse numbers and create verse objects
      verseMatches.forEach((match, index) => {
        const verseNum = parseInt(match.replace(/<[^>]*>/g, ''));
        verses.push({
          reference: `${book} ${chapter}:${verseNum}`,
          text: `Verse ${verseNum}`, // We'll get the full text from the HTML
          book: book,
          chapter: chapter,
          verse: verseNum
        });
      });
    }

    return verses;
  }

  /**
   * Convert Bible API book abbreviation to full name
   */
  private convertBookAbbreviation(abbr: string): string | null {
    const abbreviationMap: { [key: string]: string } = {
      'GEN': 'Genesis',
      'EXO': 'Exodus',
      'LEV': 'Leviticus',
      'NUM': 'Numbers',
      'DEU': 'Deuteronomy',
      'JOS': 'Joshua',
      'JDG': 'Judges',
      'RUT': 'Ruth',
      '1SA': '1 Samuel',
      '2SA': '2 Samuel',
      '1KI': '1 Kings',
      '2KI': '2 Kings',
      '1CH': '1 Chronicles',
      '2CH': '2 Chronicles',
      'EZR': 'Ezra',
      'NEH': 'Nehemiah',
      'EST': 'Esther',
      'JOB': 'Job',
      'PSA': 'Psalms',
      'PRO': 'Proverbs',
      'ECC': 'Ecclesiastes',
      'SNG': 'Song of Solomon',
      'ISA': 'Isaiah',
      'JER': 'Jeremiah',
      'LAM': 'Lamentations',
      'EZK': 'Ezekiel',
      'DAN': 'Daniel',
      'HOS': 'Hosea',
      'JOL': 'Joel',
      'AMO': 'Amos',
      'OBA': 'Obadiah',
      'JON': 'Jonah',
      'MIC': 'Micah',
      'NAH': 'Nahum',
      'HAB': 'Habakkuk',
      'ZEP': 'Zephaniah',
      'HAG': 'Haggai',
      'ZEC': 'Zechariah',
      'MAL': 'Malachi',
      'MAT': 'Matthew',
      'MRK': 'Mark',
      'LUK': 'Luke',
      'JHN': 'John',
      'ACT': 'Acts',
      'ROM': 'Romans',
      '1CO': '1 Corinthians',
      '2CO': '2 Corinthians',
      'GAL': 'Galatians',
      'EPH': 'Ephesians',
      'PHP': 'Philippians',
      'COL': 'Colossians',
      '1TH': '1 Thessalonians',
      '2TH': '2 Thessalonians',
      '1TI': '1 Timothy',
      '2TI': '2 Timothy',
      'TIT': 'Titus',
      'PHM': 'Philemon',
      'HEB': 'Hebrews',
      'JAS': 'James',
      '1PE': '1 Peter',
      '2PE': '2 Peter',
      '1JN': '1 John',
      '2JN': '2 John',
      '3JN': '3 John',
      'JUD': 'Jude',
      'REV': 'Revelation'
    };

    return abbreviationMap[abbr] || null;
  }

  /**
   * Get verse count for a specific chapter
   */
  private getVerseCountForChapter(book: string, chapter: number): number {
    // Verse counts for each chapter in the Bible
    const verseCounts: { [key: string]: { [key: number]: number } } = {
      'Matthew': {
        1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42,
        11: 30, 12: 50, 13: 58, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34,
        21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20
      },
      'Mark': {
        1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52,
        11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20
      },
      'Luke': {
        1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42,
        11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47,
        21: 38, 22: 71, 23: 56, 24: 53
      },
      'John': {
        1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42,
        11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33, 17: 26, 18: 40, 19: 42, 20: 31,
        21: 25
      },
      'Acts': {
        1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 43, 10: 48,
        11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38,
        21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31
      },
      'Romans': {
        1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21,
        11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27
      },
      '1 Corinthians': {
        1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33,
        11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24
      },
      '2 Corinthians': {
        1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18,
        11: 33, 12: 21, 13: 14
      },
      'Galatians': {
        1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18
      },
      'Ephesians': {
        1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24
      },
      'Philippians': {
        1: 30, 2: 30, 3: 21, 4: 23
      },
      'Colossians': {
        1: 29, 2: 23, 3: 25, 4: 18
      },
      '1 Thessalonians': {
        1: 10, 2: 20, 3: 13, 4: 18, 5: 28
      },
      '2 Thessalonians': {
        1: 12, 2: 17, 3: 18
      },
      '1 Timothy': {
        1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21
      },
      '2 Timothy': {
        1: 18, 2: 26, 3: 17, 4: 22
      },
      'Titus': {
        1: 16, 2: 15, 3: 15
      },
      'Philemon': {
        1: 25
      },
      'Hebrews': {
        1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39,
        11: 40, 12: 29, 13: 25
      },
      'James': {
        1: 27, 2: 26, 3: 18, 4: 17, 5: 20
      },
      '1 Peter': {
        1: 25, 2: 25, 3: 22, 4: 19, 5: 14
      },
      '2 Peter': {
        1: 21, 2: 22, 3: 18
      },
      '1 John': {
        1: 10, 2: 29, 3: 24, 4: 21, 5: 21
      },
      '2 John': {
        1: 13
      },
      '3 John': {
        1: 14
      },
      'Jude': {
        1: 25
      },
      'Revelation': {
        1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11,
        11: 19, 12: 18, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15,
        21: 27, 22: 21
      }
    };

    return verseCounts[book]?.[chapter] || 0;
  }

  /**
   * Get book name from book number
   */
  private getBookNameFromNumber(bookNum: number): string {
    const books = [
      'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
      'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
      '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
      'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
      'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
      'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel',
      'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah',
      'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
      'Zechariah', 'Malachi', 'Matthew', 'Mark', 'Luke',
      'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
      'Galatians', 'Ephesians', 'Philippians', 'Colossians',
      '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
      'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter',
      '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
    ];

    return books[bookNum - 1] || 'Unknown';
  }

  /**
   * Format content with superscript verse numbers
   */
  private formatContentWithSuperscript(html: string): string {
    // ESV API returns HTML with verse numbers in <span class="v"> tags
    // Convert these to superscript format
    return html.replace(/<span[^>]*class="v"[^>]*>(\d+)<\/span>/g, '<sup>$1</sup>');
  }

      /**
   * Test ESV API connection
   */
  testConnection(): Observable<boolean> {
    const apiKey = environment.esvBible?.apiKey;

    if (!apiKey) {
      console.log('❌ No ESV API key configured');
      return from(Promise.resolve(false));
    }

    console.log('🔍 Testing ESV API with key:', apiKey.substring(0, 10) + '...');

    const headers = new HttpHeaders({
      'Authorization': `Token ${apiKey}`
    });

    const params: Record<string, string> = {
      q: 'John 3:16',
      'include-passage-references': 'true',
      'include-verse-numbers': 'true',
      'include-first-verse-numbers': 'true',
      'include-footnotes': 'false',
      'include-headings': 'false',
      'include-subheadings': 'false',
      'include-audio-link': 'false'
    };

    const url = `${this.baseUrl}`;
    console.log('🔍 Testing ESV API with URL:', url);
    console.log('🔍 Testing ESV API with params:', params);

    return this.http.get<ESVApiResponse>(url, { headers, params }).pipe(
      map(response => {
        console.log('✅ ESV API test successful:', response);

        // Check if response has passages array (ESV API structure)
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ ESV API returned passages');
          return true;
        } else {
          console.log('❌ ESV API returned no passages');
          return false;
        }
      }),
      catchError(error => {
        console.error('❌ ESV API test failed:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message
        });
        return from(Promise.resolve(false));
      })
    );
  }

  /**
   * Check if ESV API key is configured
   */
  isApiKeyConfigured(): boolean {
    return !!environment.esvBible?.apiKey;
  }

  /**
   * Test a specific reference with detailed logging
   */
  testSpecificReference(reference: string): Observable<any> {
    const apiKey = environment.esvBible?.apiKey;

    if (!apiKey) {
      console.log('❌ No ESV API key configured');
      return from(Promise.resolve(null));
    }

    console.log('🔍 Testing specific reference:', reference);

    const formattedReference = this.formatReferenceForESV(reference);
    console.log('🔍 Formatted reference:', formattedReference);

    const headers = new HttpHeaders({
      'Authorization': `Token ${apiKey}`
    });

    const params: Record<string, string> = {
      q: formattedReference || '',
      'include-passage-references': 'true',
      'include-verse-numbers': 'true',
      'include-first-verse-numbers': 'true',
      'include-footnotes': 'false',
      'include-headings': 'false',
      'include-subheadings': 'false',
      'include-audio-link': 'false'
    };

    const url = `${this.baseUrl}`;
    console.log('🔍 Testing with URL:', url);
    console.log('🔍 Testing with params:', params);

    return this.http.get<ESVApiResponse>(url, { headers, params }).pipe(
      map(response => {
        console.log('🔍 Raw response:', response);

        // Check if response has passages array (ESV API structure)
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ ESV API returned passages:', response.passages[0].substring(0, 100) + '...');
          return response;
        } else {
          console.log('❌ ESV API returned no passages');
          return null;
        }
      }),
      catchError(error => {
        console.error('❌ Error testing reference:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test ESV API with minimal parameters
   */
  testMinimalESV(): Observable<any> {
    const apiKey = environment.esvBible?.apiKey;

    if (!apiKey) {
      console.log('❌ No ESV API key configured');
      return from(Promise.resolve(null));
    }

    console.log('🔍 Testing ESV API with minimal parameters...');

    const headers = new HttpHeaders({
      'Authorization': `Token ${apiKey}`
    });

    // Try with just the basic query parameter
    const params: Record<string, string> = {
      q: 'John 3:16'
    };

    const url = `${this.baseUrl}`;
    console.log('🔍 Testing minimal ESV API with URL:', url);
    console.log('🔍 Testing minimal ESV API with params:', params);

    return this.http.get<any>(url, { headers, params }).pipe(
      map(response => {
        console.log('🔍 Minimal ESV API response:', response);

        // Check if response has passages array (ESV API structure)
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ ESV API returned passages:', response.passages);
          return response;
        } else {
          console.log('❌ ESV API returned no passages');
          return null;
        }
      }),
      catchError(error => {
        console.error('❌ Minimal ESV API error:', error);
        return from(Promise.resolve(null));
      })
    );
  }
}
