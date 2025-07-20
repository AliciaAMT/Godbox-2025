import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, catchError, mergeMap, filter, take, toArray } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface BibleVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface BiblePassage {
  reference: string;
  text: string;
  verses: BibleVerse[];
  content?: string; // Optional content property for HTML content
}

export interface ApiBibleResponse {
  data: {
    id: string;
    reference: string;
    text: string;
    content?: string; // HTML content with scripture text
    verses: Array<{
      id: string;
      reference: string;
      text: string;
      bookId: string;
      chapterId: string;
      verseId: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BibleApiService {
  private readonly baseUrl = 'https://api.scripture.api.bible/v1';
  private readonly bibleId = '65eec8e0b60e656b-01'; // KJV Bible ID

  // Alternative Bible IDs to try if the main one fails
  // Updated based on test results - only working Bible IDs
  private readonly alternativeBibleIds = [
    'de4e12af7f28f599-02', // ESV
    '65eec8e0b60e656b-01', // KJV
    '9879dbb7cfe39e4d-01', // NASB
    '179568874c45066f-01', // NKJV
  ];

  constructor(private http: HttpClient) { }

  /**
   * Extract text from passage content, stripping HTML tags
   */
  private extractTextFromContent(passage: any): string {
    console.log('extractTextFromContent called with passage:', passage);
    if (passage.text) {
      console.log('Using passage.text:', passage.text);
      return passage.text;
    }
    if (passage.content) {
      console.log('Using passage.content:', passage.content);
      // Strip HTML tags from content
      const extractedText = passage.content.replace(/<[^>]*>/g, '').trim();
      console.log('Extracted text from content:', extractedText);
      return extractedText;
    }
    console.log('No text or content found');
    return '';
  }

  /**
   * Create a BiblePassage object with proper text extraction
   */
  private createBiblePassage(passage: any, verses: BibleVerse[]): BiblePassage {
    const text = this.extractTextFromContent(passage);
    console.log('🔍 createBiblePassage - extracted text length:', text.length);
    console.log('🔍 createBiblePassage - extracted text preview:', text.substring(0, 100));
    console.log('🔍 createBiblePassage - final BiblePassage object:', {
      reference: passage.reference,
      text: text,
      versesCount: verses.length,
      hasContent: !!passage.content
    });
    return {
      reference: passage.reference,
      text: text,
      verses: verses,
      content: passage.content
    };
  }

  /**
   * Get a passage of scripture by reference
   */
  getPassage(reference: string): Observable<BiblePassage | null> {
    const apiKey = environment.apiBible?.apiKey;

    if (!apiKey) {
      console.warn('Bible API key not configured');
      return from(Promise.resolve(null));
    }

    // Clean and format the reference
    const formattedReference = this.formatReferenceForApi(reference);
    if (!formattedReference) {
      console.error('Invalid reference format:', reference);
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Try with a simpler approach first
    const url = `${this.baseUrl}/bibles/${this.bibleId}/passages/${encodeURIComponent(formattedReference)}`;
    console.log('Fetching passage from:', url);

    return this.http.get<ApiBibleResponse>(url, { headers }).pipe(
              map(response => {
                      console.log('Raw response from main Bible ID:', response);
            console.log('Response data structure:', JSON.stringify(response.data, null, 2));
            console.log('Passage object keys:', Object.keys(response.data));
            console.log('Passage text property:', response.data.text);
          if (response && response.data) {
            console.log('✅ Main Bible ID succeeded');
            const passage = response.data;

          // Check if verses array exists, if not, create a single verse from the passage
          let verses: BibleVerse[];
          if (passage.verses && Array.isArray(passage.verses)) {
            verses = passage.verses.map(verse => ({
              reference: verse.reference,
              text: verse.text,
              book: verse.bookId,
              chapter: parseInt(verse.chapterId),
              verse: parseInt(verse.verseId)
            }));
                      } else {
              // If no verses array, create a single verse from the passage data
              console.log('No verses array found, creating single verse from passage data');

              // Parse the reference to extract book, chapter, and verse
              const parsedRef = this.parseReference(passage.reference);
              verses = [{
                reference: passage.reference || 'Unknown',
                text: passage.text || '',
                book: parsedRef?.book || 'Unknown',
                chapter: parsedRef?.chapter || 1,
                verse: parsedRef?.verseStart || 1
              }];
            }

            // Use helper method to create BiblePassage with proper text extraction
            console.log('First verse object:', verses[0]);
            return this.createBiblePassage(passage, verses);
        } else {
          console.log('❌ No data in main Bible ID response:', response);
          return null;
        }
      }),
      catchError(error => {
        console.error('Error fetching passage:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: url,
          reference: reference,
          formattedReference: formattedReference
        });

        // Try with a different Bible ID as fallback
        return this.tryAlternativeBibleId(formattedReference, headers, reference);
      })
    );
  }

  /**
   * Try with an alternative Bible ID if the main one fails
   */
  private tryAlternativeBibleId(formattedReference: string, headers: HttpHeaders, originalReference: string): Observable<BiblePassage | null> {
    // Try each alternative Bible ID
    const tryNextBibleId = (index: number): Observable<BiblePassage | null> => {
      if (index >= this.alternativeBibleIds.length) {
        console.error('All Bible IDs failed for reference:', originalReference);
        // If all Bible IDs failed, try fetching individual verses
        return this.tryIndividualVerses(originalReference, headers);
      }

      const bibleId = this.alternativeBibleIds[index];
      const url = `${this.baseUrl}/bibles/${bibleId}/passages/${encodeURIComponent(formattedReference)}`;
      console.log(`Trying Bible ID ${index + 1}/${this.alternativeBibleIds.length}: ${bibleId}`, url);

      return this.http.get<ApiBibleResponse>(url, { headers }).pipe(
        map(response => {
          console.log(`Raw response for Bible ID ${bibleId}:`, response);
          console.log(`Response data structure for ${bibleId}:`, JSON.stringify(response.data, null, 2));
          if (response && response.data) {
            console.log(`✅ Success with Bible ID: ${bibleId}`);
            const passage = response.data;

            // Check if verses array exists, if not, create a single verse from the passage
            let verses: BibleVerse[];
            if (passage.verses && Array.isArray(passage.verses)) {
              verses = passage.verses.map(verse => ({
                reference: verse.reference,
                text: verse.text,
                book: verse.bookId,
                chapter: parseInt(verse.chapterId),
                verse: parseInt(verse.verseId)
              }));
            } else {
              // If no verses array, create a single verse from the passage data
              console.log('No verses array found, creating single verse from passage data');

              // Parse the reference to extract book, chapter, and verse
              const parsedRef = this.parseReference(passage.reference);
              verses = [{
                reference: passage.reference || 'Unknown',
                text: passage.text || '',
                book: parsedRef?.book || 'Unknown',
                chapter: parsedRef?.chapter || 1,
                verse: parsedRef?.verseStart || 1
              }];
            }

            // Use helper method to create BiblePassage with proper text extraction
            console.log('First verse object:', verses[0]);
            return this.createBiblePassage(passage, verses);
          } else {
            console.log(`❌ No data in response for Bible ID ${bibleId}:`, response);
            return null;
          }
        }),
        catchError(error => {
          console.log(`❌ Bible ID ${bibleId} failed:`, error.status, error.statusText, error);
          // Try the next Bible ID
          return tryNextBibleId(index + 1);
        })
      );
    };

    return tryNextBibleId(0);
  }

    /**
   * Try fetching individual verses when range fails
   */
  private tryIndividualVerses(reference: string, headers: HttpHeaders): Observable<BiblePassage | null> {
    console.log('All Bible IDs failed, trying individual verses for:', reference);

    // Parse the reference to get verse range
    const parsedRef = this.parseReference(reference);
    if (!parsedRef) {
      console.error('Could not parse reference for individual verses:', reference);
      return from(Promise.resolve(null));
    }

    const { book, chapter, verseStart, verseEnd } = parsedRef;
    const endVerse = verseEnd || verseStart;

    console.log(`Fetching individual verses ${verseStart}-${endVerse} from ${book} ${chapter}`);

    // Create array of verse numbers to fetch
    const verseNumbers = [];
    for (let i = verseStart; i <= endVerse; i++) {
      verseNumbers.push(i);
    }

    // Fetch each verse individually
    const verseRequests = verseNumbers.map(verseNum => {
      const verseRef = `${book}.${chapter}.${verseNum}`;
      const url = `${this.baseUrl}/bibles/${this.bibleId}/passages/${encodeURIComponent(verseRef)}`;
      console.log(`Fetching individual verse: ${verseRef}`);

      return this.http.get<ApiBibleResponse>(url, { headers }).pipe(
        map(response => {
          if (response && response.data) {
            return {
              reference: response.data.reference,
              text: response.data.text || '',
              book: book,
              chapter: chapter,
              verse: verseNum
            } as BibleVerse;
          }
          return null;
        }),
        catchError(error => {
          console.log(`Failed to fetch verse ${verseNum}:`, error.status, error.statusText);
          return from(Promise.resolve(null));
        })
      );
    });

    // Combine all successful verse requests
    return from(verseRequests).pipe(
      mergeMap(request => request),
      filter((verse): verse is BibleVerse => verse !== null),
      toArray(),
      map((verses: BibleVerse[]) => {
        if (verses.length === 0) {
          console.error('No individual verses could be fetched');
          return null;
        }

        console.log(`Successfully fetched ${verses.length} individual verses`);

        // Combine all verse texts
        const combinedText = verses.map(v => v.text).join(' ');

        return {
          reference: reference,
          text: combinedText,
          verses: verses,
          content: `<p>${combinedText}</p>`
        } as BiblePassage;
      }),
      catchError(error => {
        console.error('Error fetching individual verses:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Get a single verse by reference
   */
    getVerse(reference: string): Observable<BibleVerse | null> {
    const apiKey = environment.apiBible?.apiKey;

    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey
    });

    const url = `${this.baseUrl}/bibles/${this.bibleId}/verses/${encodeURIComponent(reference)}`;

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.data) {
          const verse = response.data;
          return {
            reference: verse.reference,
            text: verse.text,
            book: verse.bookId,
            chapter: parseInt(verse.chapterId),
            verse: parseInt(verse.verseId)
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching verse:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Get available Bibles
   */
    getBibles(): Observable<any[]> {
    const apiKey = environment.apiBible?.apiKey;

    if (!apiKey) {
      return from(Promise.resolve([]));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey
    });

    const url = `${this.baseUrl}/bibles`;

    return this.http.get<any>(url, { headers }).pipe(
      map(response => response?.data || []),
      catchError(error => {
        console.error('Error fetching bibles:', error);
        return from(Promise.resolve([]));
      })
    );
  }

  /**
   * Search for verses containing specific text
   */
    searchVerses(query: string): Observable<BibleVerse[]> {
    const apiKey = environment.apiBible?.apiKey;

    if (!apiKey) {
      return from(Promise.resolve([]));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey
    });

    const url = `${this.baseUrl}/bibles/${this.bibleId}/search?query=${encodeURIComponent(query)}`;

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        if (response && response.data) {
          return response.data.verses.map((verse: any) => ({
            reference: verse.reference,
            text: verse.text,
            book: verse.bookId,
            chapter: parseInt(verse.chapterId),
            verse: parseInt(verse.verseId)
          }));
        }
        return [];
      }),
      catchError(error => {
        console.error('Error searching verses:', error);
        return from(Promise.resolve([]));
      })
    );
  }

  /**
   * Format reference for api.bible (e.g., "Genesis 1:1-5")
   */
  formatReference(book: string, chapter: number, verseStart: number, verseEnd?: number): string {
    if (verseEnd && verseEnd !== verseStart) {
      return `${book} ${chapter}:${verseStart}-${verseEnd}`;
    }
    return `${book} ${chapter}:${verseStart}`;
  }

  /**
   * Parse reference string to extract book, chapter, and verses
   */
  parseReference(reference: string): { book: string; chapter: number; verseStart: number; verseEnd?: number } | null {
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (match) {
      return {
        book: match[1].trim(),
        chapter: parseInt(match[2]),
        verseStart: parseInt(match[3]),
        verseEnd: match[4] ? parseInt(match[4]) : undefined
      };
    }
    return null;
  }

  /**
   * Format reference for api.bible API
   * Converts common book names to the format expected by the API
   */
  private formatReferenceForApi(reference: string): string | null {
    if (!reference) return null;

    // Clean up the reference
    let formatted = reference.trim();
    console.log('Original reference:', reference);

    // If the reference is already in the correct format (e.g., "NUM.25.10-18"), return it as is
    if (formatted.includes('.')) {
      console.log('Reference already in correct format:', formatted);
      return formatted;
    }

    // Common book name mappings for api.bible
    const bookMappings: { [key: string]: string } = {
      'Genesis': 'GEN',
      'Exodus': 'EXO',
      'Leviticus': 'LEV',
      'Numbers': 'NUM',
      'Deuteronomy': 'DEU',
      'Joshua': 'JOS',
      'Judges': 'JUD',
      'Ruth': 'RUT',
      '1 Samuel': '1SA',
      '2 Samuel': '2SA',
      '1 Kings': '1KI',
      '2 Kings': '2KI',
      '1 Chronicles': '1CH',
      '2 Chronicles': '2CH',
      'Ezra': 'EZR',
      'Nehemiah': 'NEH',
      'Esther': 'EST',
      'Job': 'JOB',
      'Psalms': 'PSA',
      'Psalm': 'PSA',
      'Proverbs': 'PRO',
      'Ecclesiastes': 'ECC',
      'Song of Solomon': 'SON',
      'Isaiah': 'ISA',
      'Jeremiah': 'JER',
      'Lamentations': 'LAM',
      'Ezekiel': 'EZE',
      'Daniel': 'DAN',
      'Hosea': 'HOS',
      'Joel': 'JOE',
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
      'Mark': 'MAR',
      'Luke': 'LUK',
      'John': 'JOH',
      'Acts': 'ACT',
      'Romans': 'ROM',
      '1 Corinthians': '1CO',
      '2 Corinthians': '2CO',
      'Galatians': 'GAL',
      'Ephesians': 'EPH',
      'Philippians': 'PHI',
      'Colossians': 'COL',
      '1 Thessalonians': '1TH',
      '2 Thessalonians': '2TH',
      '1 Timothy': '1TI',
      '2 Timothy': '2TI',
      'Titus': 'TIT',
      'Philemon': 'PHM',
      'Hebrews': 'HEB',
      'James': 'JAM',
      '1 Peter': '1PE',
      '2 Peter': '2PE',
      '1 John': '1JO',
      '2 John': '2JO',
      '3 John': '3JO',
      'Jude': 'JUD',
      'Revelation': 'REV'
    };

    // Try to match and replace book names
    for (const [fullName, shortName] of Object.entries(bookMappings)) {
      if (formatted.startsWith(fullName + ' ')) {
        formatted = formatted.replace(fullName, shortName);
        break;
      }
    }

    console.log('Formatted reference:', formatted);

    // Handle chapter ranges like "1Kgs 18:46-19:21"
    const chapterRangeMatch = formatted.match(/^([A-Za-z]+)\s+(\d+):(\d+)-(\d+):(\d+)$/);
    if (chapterRangeMatch) {
      const book = chapterRangeMatch[1];
      const startChapter = chapterRangeMatch[2];
      const startVerse = chapterRangeMatch[3];
      const endChapter = chapterRangeMatch[4];
      const endVerse = chapterRangeMatch[5];

      // Format as "Book.StartChapter.StartVerse-Book.EndChapter.EndVerse"
      const result = `${book}.${startChapter}.${startVerse}-${book}.${endChapter}.${endVerse}`;
      console.log('Chapter range format result:', result);
      return result;
    }

    // Handle full chapter references like "Numbers 1" or "Gen 1"
    const fullChapterMatch = formatted.match(/^([A-Za-z]+)\s+(\d+)$/);
    if (fullChapterMatch) {
      const book = fullChapterMatch[1];
      const chapter = fullChapterMatch[2];

      // Get the number of verses for this chapter
      const verseCount = this.getVerseCountForChapter(book, parseInt(chapter));
      if (verseCount > 0) {
        // Format as "Book.Chapter.1-Book.Chapter.LastVerse"
        const result = `${book}.${chapter}.1-${book}.${chapter}.${verseCount}`;
        console.log('Full chapter format result:', result);
        return result;
      }
    }

    // Handle verse ranges within same chapter like "Gen 1:1-5"
    const verseRangeMatch = formatted.match(/^([A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (verseRangeMatch) {
      const book = verseRangeMatch[1];
      const chapter = verseRangeMatch[2];
      const verseStart = verseRangeMatch[3];
      const verseEnd = verseRangeMatch[4];

      if (verseEnd) {
        // Range format: "Book.Chapter.StartVerse-Book.Chapter.EndVerse"
        return `${book}.${chapter}.${verseStart}-${book}.${chapter}.${verseEnd}`;
      } else {
        // Single verse format: "Book.Chapter.Verse"
        return `${book}.${chapter}.${verseStart}`;
      }
    }

    console.error('Invalid reference format after formatting:', formatted);
    return null;
  }

  /**
   * Get the number of verses for a specific chapter
   */
  private getVerseCountForChapter(book: string, chapter: number): number {
    // Verse counts for each book and chapter
    const verseCounts: { [key: string]: { [key: number]: number } } = {
      'GEN': {
        1: 31, 2: 25, 3: 24, 4: 26, 5: 32, 6: 22, 7: 24, 8: 22, 9: 29, 10: 32,
        11: 32, 12: 20, 13: 18, 14: 24, 15: 21, 16: 16, 17: 27, 18: 33, 19: 38, 20: 18,
        21: 34, 22: 24, 23: 20, 24: 67, 25: 34, 26: 35, 27: 46, 28: 22, 29: 35, 30: 43,
        31: 55, 32: 32, 33: 20, 34: 31, 35: 29, 36: 43, 37: 36, 38: 30, 39: 23, 40: 23,
        41: 57, 42: 38, 43: 34, 44: 34, 45: 28, 46: 34, 47: 31, 48: 22, 49: 33, 50: 26
      },
      'EXO': {
        1: 22, 2: 25, 3: 22, 4: 31, 5: 23, 6: 27, 7: 29, 8: 28, 9: 35, 10: 29,
        11: 10, 12: 51, 13: 22, 14: 31, 15: 27, 16: 36, 17: 16, 18: 27, 19: 25, 20: 26,
        21: 36, 22: 31, 23: 33, 24: 18, 25: 40, 26: 37, 27: 21, 28: 43, 29: 46, 30: 38,
        31: 18, 32: 35, 33: 23, 34: 35, 35: 35, 36: 38, 37: 29, 38: 31, 39: 43, 40: 38
      },
      'LEV': {
        1: 17, 2: 16, 3: 17, 4: 35, 5: 19, 6: 30, 7: 38, 8: 36, 9: 24, 10: 20,
        11: 47, 12: 8, 13: 59, 14: 57, 15: 33, 16: 34, 17: 16, 18: 30, 19: 37, 20: 27,
        21: 24, 22: 33, 23: 44, 24: 23, 25: 55, 26: 46, 27: 34
      },
      'NUM': {
        1: 54, 2: 34, 3: 51, 4: 49, 5: 31, 6: 27, 7: 89, 8: 26, 9: 23, 10: 36,
        11: 35, 12: 16, 13: 33, 14: 45, 15: 41, 16: 50, 17: 13, 18: 32, 19: 22, 20: 29,
        21: 35, 22: 41, 23: 30, 24: 25, 25: 18, 26: 65, 27: 23, 28: 31, 29: 40, 30: 16,
        31: 54, 32: 42, 33: 56, 34: 29, 35: 34, 36: 13
      },
      'DEU': {
        1: 46, 2: 37, 3: 29, 4: 49, 5: 33, 6: 25, 7: 26, 8: 20, 9: 29, 10: 22,
        11: 32, 12: 32, 13: 18, 14: 29, 15: 23, 16: 22, 17: 20, 18: 22, 19: 21, 20: 20,
        21: 23, 22: 30, 23: 25, 24: 22, 25: 19, 26: 19, 27: 26, 28: 68, 29: 29, 30: 20,
        31: 30, 32: 52, 33: 29, 34: 12
      },
      'JOS': {
        1: 18, 2: 24, 3: 17, 4: 24, 5: 15, 6: 27, 7: 26, 8: 35, 9: 27, 10: 43,
        11: 23, 12: 24, 13: 33, 14: 15, 15: 63, 16: 10, 17: 18, 18: 28, 19: 51, 20: 9,
        21: 45, 22: 34, 23: 16, 24: 33
      },
      'JUD': {
        1: 36, 2: 23, 3: 31, 4: 24, 5: 31, 6: 40, 7: 25, 8: 35, 9: 57, 10: 18,
        11: 40, 12: 15, 13: 25, 14: 20, 15: 20, 16: 31, 17: 13, 18: 31, 19: 30, 20: 48,
        21: 25
      },
      '1SA': {
        1: 28, 2: 36, 3: 21, 4: 22, 5: 12, 6: 21, 7: 17, 8: 22, 9: 27, 10: 27,
        11: 15, 12: 25, 13: 23, 14: 52, 15: 35, 16: 23, 17: 58, 18: 30, 19: 24, 20: 42,
        21: 15, 22: 23, 23: 29, 24: 22, 25: 44, 26: 25, 27: 12, 28: 25, 29: 11, 30: 31,
        31: 13
      },
      '2SA': {
        1: 27, 2: 32, 3: 39, 4: 12, 5: 25, 6: 23, 7: 29, 8: 18, 9: 13, 10: 19,
        11: 27, 12: 31, 13: 39, 14: 33, 15: 37, 16: 23, 17: 29, 18: 33, 19: 43, 20: 26,
        21: 22, 22: 51, 23: 39, 24: 25
      },
      '1KI': {
        1: 53, 2: 46, 3: 28, 4: 34, 5: 18, 6: 38, 7: 51, 8: 66, 9: 28, 10: 29,
        11: 43, 12: 33, 13: 34, 14: 31, 15: 34, 16: 34, 17: 24, 18: 46, 19: 21, 20: 43,
        21: 29, 22: 53
      },
      '2KI': {
        1: 18, 2: 25, 3: 27, 4: 44, 5: 27, 6: 33, 7: 20, 8: 29, 9: 37, 10: 20,
        11: 21, 12: 25, 13: 25, 14: 29, 15: 38, 16: 20, 17: 41, 18: 37, 19: 37, 20: 21,
        21: 26, 22: 20, 23: 37, 24: 20, 25: 30
      },
      'ISA': {
        1: 31, 2: 22, 3: 26, 4: 6, 5: 30, 6: 13, 7: 25, 8: 22, 9: 21, 10: 34,
        11: 16, 12: 6, 13: 22, 14: 32, 15: 9, 16: 14, 17: 14, 18: 7, 19: 25, 20: 6,
        21: 17, 22: 25, 23: 18, 24: 23, 25: 12, 26: 21, 27: 13, 28: 29, 29: 24, 30: 33,
        31: 9, 32: 20, 33: 24, 34: 17, 35: 10, 36: 22, 37: 38, 38: 22, 39: 8, 40: 31,
        41: 29, 42: 25, 43: 28, 44: 28, 45: 25, 46: 13, 47: 15, 48: 22, 49: 26, 50: 11,
        51: 23, 52: 15, 53: 12, 54: 17, 55: 13, 56: 12, 57: 21, 58: 14, 59: 21, 60: 22,
        61: 11, 62: 12, 63: 19, 64: 12, 65: 25, 66: 24
      },
      'JER': {
        1: 19, 2: 37, 3: 25, 4: 31, 5: 31, 6: 30, 7: 34, 8: 22, 9: 26, 10: 25,
        11: 23, 12: 17, 13: 27, 14: 22, 15: 21, 16: 21, 17: 27, 18: 23, 19: 15, 20: 18,
        21: 14, 22: 30, 23: 40, 24: 10, 25: 38, 26: 24, 27: 22, 28: 2, 29: 32, 30: 24,
        31: 40, 32: 44, 33: 26, 34: 22, 35: 19, 36: 32, 37: 21, 38: 28, 39: 18, 40: 16,
        41: 18, 42: 22, 43: 13, 44: 30, 45: 5, 46: 28, 47: 7, 48: 47, 49: 39, 50: 46,
        51: 64, 52: 34
      },
      'EZE': {
        1: 28, 2: 10, 3: 27, 4: 17, 5: 17, 6: 14, 7: 27, 8: 18, 9: 11, 10: 22,
        11: 25, 12: 28, 13: 23, 14: 23, 15: 8, 16: 63, 17: 24, 18: 32, 19: 14, 20: 49,
        21: 32, 22: 31, 23: 49, 24: 27, 25: 17, 26: 21, 27: 36, 28: 26, 29: 21, 30: 26,
        31: 18, 32: 32, 33: 33, 34: 31, 35: 15, 36: 38, 37: 28, 38: 23, 39: 29, 40: 49,
        41: 26, 42: 20, 43: 27, 44: 31, 45: 25, 46: 24, 47: 23, 48: 35
      },
      'Dan': {
        1: 21, 2: 49, 3: 30, 4: 37, 5: 31, 6: 28, 7: 28, 8: 27, 9: 27, 10: 21,
        11: 45, 12: 13
      },
      'HOS': {
        1: 11, 2: 23, 3: 5, 4: 19, 5: 15, 6: 11, 7: 16, 8: 14, 9: 17, 10: 15,
        11: 12, 12: 14, 13: 16, 14: 9
      },
      'JOE': {
        1: 20, 2: 32, 3: 21
      },
      'AMO': {
        1: 15, 2: 16, 3: 15, 4: 13, 5: 27, 6: 14, 7: 17, 8: 14, 9: 15
      },
      'OBA': {
        1: 21
      },
      'JON': {
        1: 17, 2: 10, 3: 10, 4: 11
      },
      'MIC': {
        1: 16, 2: 13, 3: 12, 4: 13, 5: 15, 6: 16, 7: 20
      },
      'NAH': {
        1: 15, 2: 13, 3: 19
      },
      'HAB': {
        1: 17, 2: 20, 3: 19
      },
      'ZEP': {
        1: 18, 2: 15, 3: 20
      },
      'HAG': {
        1: 15, 2: 23
      },
      'ZEC': {
        1: 21, 2: 13, 3: 10, 4: 14, 5: 11, 6: 15, 7: 14, 8: 23, 9: 17, 10: 12,
        11: 17, 12: 14, 13: 9, 14: 21
      },
      'MAL': {
        1: 14, 2: 17, 3: 18, 4: 6
      },
      'PSA': {
        1: 6, 2: 12, 3: 8, 4: 8, 5: 12, 6: 10, 7: 17, 8: 9, 9: 20, 10: 18,
        11: 7, 12: 8, 13: 6, 14: 7, 15: 5, 16: 11, 17: 15, 18: 10, 19: 14, 20: 9,
        21: 13, 22: 31, 23: 6, 24: 10, 25: 22, 26: 12, 27: 15, 28: 9, 29: 20, 30: 12,
        31: 24, 32: 11, 33: 22, 34: 22, 35: 28, 36: 12, 37: 40, 38: 22, 39: 13, 40: 17,
        41: 13, 42: 11, 43: 5, 44: 26, 45: 17, 46: 11, 47: 9, 48: 14, 49: 20, 50: 23,
        51: 19, 52: 9, 53: 6, 54: 7, 55: 23, 56: 13, 57: 11, 58: 11, 59: 17, 60: 12,
        61: 8, 62: 12, 63: 11, 64: 10, 65: 13, 66: 20, 67: 7, 68: 35, 69: 36, 70: 20,
        71: 23, 72: 20, 73: 28, 74: 9, 75: 10, 76: 12, 77: 21, 78: 10, 79: 9, 80: 18,
        81: 16, 82: 8, 83: 18, 84: 12, 85: 11, 86: 17, 87: 11, 88: 18, 89: 52, 90: 17,
        91: 16, 92: 15, 93: 5, 94: 19, 95: 11, 96: 16, 97: 12, 98: 9, 99: 5, 100: 8,
        101: 28, 102: 22, 103: 12, 104: 9, 105: 11, 106: 12, 107: 24, 108: 11, 109: 22,
        110: 22, 111: 28, 112: 12, 113: 18, 114: 9, 115: 13, 116: 19, 117: 27, 118: 31,
        119: 31, 120: 32, 121: 22, 122: 29, 123: 6, 124: 25, 125: 22, 126: 31, 127: 26,
        128: 6, 129: 22, 130: 23, 131: 25, 132: 22, 133: 19, 134: 28, 135: 13, 136: 26,
        137: 20, 138: 27, 139: 20, 140: 28, 141: 13, 142: 28, 143: 13, 144: 14, 145: 21,
        146: 22, 147: 20, 148: 8, 149: 9, 150: 6
      },
      'PRO': {
        1: 33, 2: 22, 3: 35, 4: 27, 5: 23, 6: 35, 7: 27, 8: 36, 9: 18, 10: 32,
        11: 31, 12: 28, 13: 25, 14: 35, 15: 33, 16: 33, 17: 28, 18: 24, 19: 29, 20: 30,
        21: 31, 22: 29, 23: 35, 24: 34, 25: 28, 26: 28, 27: 27, 28: 28, 29: 27, 30: 33,
        31: 31
      },
      'ECC': {
        1: 18, 2: 26, 3: 22, 4: 16, 5: 20, 6: 12, 7: 29, 8: 17, 9: 18, 10: 20,
        11: 10, 12: 14
      },
      'SON': {
        1: 17, 2: 17, 3: 11, 4: 16, 5: 16, 6: 13, 7: 13, 8: 14
      },
      '1CH': {
        1: 54, 2: 55, 3: 24, 4: 43, 5: 26, 6: 81, 7: 40, 8: 40, 9: 44, 10: 14,
        11: 47, 12: 40, 13: 14, 14: 17, 15: 29, 16: 43, 17: 27, 18: 17, 19: 19, 20: 8,
        21: 30, 22: 19, 23: 32, 24: 31, 25: 31, 26: 32, 27: 30, 28: 30, 29: 30
      },
      '2CH': {
        1: 17, 2: 18, 3: 17, 4: 22, 5: 14, 6: 42, 7: 22, 8: 17, 9: 31, 10: 19,
        11: 23, 12: 16, 13: 22, 14: 15, 15: 19, 16: 14, 17: 19, 18: 34, 19: 11, 20: 37,
        21: 20, 22: 2, 23: 21, 24: 27, 25: 28, 26: 20, 27: 21, 28: 27, 29: 36, 30: 21,
        31: 21, 32: 33, 33: 25, 34: 33, 35: 27, 36: 23
      },
      'JOB': {
        1: 22, 2: 13, 3: 26, 4: 21, 5: 27, 6: 30, 7: 21, 8: 22, 9: 35, 10: 22,
        11: 20, 12: 25, 13: 28, 14: 22, 15: 35, 16: 22, 17: 16, 18: 21, 19: 29, 20: 29,
        21: 34, 22: 30, 23: 17, 24: 25, 25: 6, 26: 14, 27: 23, 28: 28, 29: 25, 30: 31,
        31: 40, 32: 22, 33: 33, 34: 37, 35: 16, 36: 33, 37: 24, 38: 41, 39: 30, 40: 24,
        41: 34, 42: 17
      },
      'EZR': {
        1: 11, 2: 70, 3: 13, 4: 24, 5: 17, 6: 22, 7: 28, 8: 36, 9: 15, 10: 44
      },
      'NEH': {
        1: 11, 2: 20, 3: 32, 4: 23, 5: 19, 6: 19, 7: 73, 8: 18, 9: 38, 10: 39,
        11: 36, 12: 47, 13: 31
      },
      // New Testament verse counts
      'MAT': {
        1: 25, 2: 23, 3: 17, 4: 25, 5: 48, 6: 34, 7: 29, 8: 34, 9: 38, 10: 42,
        11: 30, 12: 50, 13: 58, 14: 36, 15: 39, 16: 28, 17: 27, 18: 35, 19: 30, 20: 34,
        21: 46, 22: 46, 23: 39, 24: 51, 25: 46, 26: 75, 27: 66, 28: 20
      },
      'MAR': {
        1: 45, 2: 28, 3: 35, 4: 41, 5: 43, 6: 56, 7: 37, 8: 38, 9: 50, 10: 52,
        11: 33, 12: 44, 13: 37, 14: 72, 15: 47, 16: 20
      },
      'LUK': {
        1: 80, 2: 52, 3: 38, 4: 44, 5: 39, 6: 49, 7: 50, 8: 56, 9: 62, 10: 42,
        11: 54, 12: 59, 13: 35, 14: 35, 15: 32, 16: 31, 17: 37, 18: 43, 19: 48, 20: 47,
        21: 38, 22: 71, 23: 56, 24: 53
      },
      'JOH': {
        1: 51, 2: 25, 3: 36, 4: 54, 5: 47, 6: 71, 7: 53, 8: 59, 9: 41, 10: 42,
        11: 57, 12: 50, 13: 38, 14: 31, 15: 27, 16: 33, 17: 26, 18: 40, 19: 42, 20: 31,
        21: 25
      },
      'ACT': {
        1: 26, 2: 47, 3: 26, 4: 37, 5: 42, 6: 15, 7: 60, 8: 40, 9: 43, 10: 48,
        11: 30, 12: 25, 13: 52, 14: 28, 15: 41, 16: 40, 17: 34, 18: 28, 19: 41, 20: 38,
        21: 40, 22: 30, 23: 35, 24: 27, 25: 27, 26: 32, 27: 44, 28: 31
      },
      'ROM': {
        1: 32, 2: 29, 3: 31, 4: 25, 5: 21, 6: 23, 7: 25, 8: 39, 9: 33, 10: 21,
        11: 36, 12: 21, 13: 14, 14: 23, 15: 33, 16: 27
      },
      '1CO': {
        1: 31, 2: 16, 3: 23, 4: 21, 5: 13, 6: 20, 7: 40, 8: 13, 9: 27, 10: 33,
        11: 34, 12: 31, 13: 13, 14: 40, 15: 58, 16: 24
      },
      '2CO': {
        1: 24, 2: 17, 3: 18, 4: 18, 5: 21, 6: 18, 7: 16, 8: 24, 9: 15, 10: 18,
        11: 33, 12: 21, 13: 14
      },
      'GAL': {
        1: 24, 2: 21, 3: 29, 4: 31, 5: 26, 6: 18
      },
      'EPH': {
        1: 23, 2: 22, 3: 21, 4: 32, 5: 33, 6: 24
      },
      'PHI': {
        1: 30, 2: 30, 3: 21, 4: 23
      },
      'COL': {
        1: 29, 2: 23, 3: 25, 4: 18
      },
      '1TH': {
        1: 10, 2: 20, 3: 13, 4: 18, 5: 28
      },
      '2TH': {
        1: 12, 2: 17, 3: 18
      },
      '1TI': {
        1: 20, 2: 15, 3: 16, 4: 16, 5: 25, 6: 21
      },
      '2TI': {
        1: 18, 2: 26, 3: 17, 4: 22
      },
      'TIT': {
        1: 16, 2: 15, 3: 15
      },
      'PHM': {
        1: 25
      },
      'HEB': {
        1: 14, 2: 18, 3: 19, 4: 16, 5: 14, 6: 20, 7: 28, 8: 13, 9: 28, 10: 39,
        11: 40, 12: 29, 13: 25
      },
      'JAM': {
        1: 27, 2: 26, 3: 18, 4: 17, 5: 20
      },
      '1PE': {
        1: 25, 2: 25, 3: 22, 4: 19, 5: 14
      },
      '2PE': {
        1: 21, 2: 22, 3: 18
      },
      '1JO': {
        1: 10, 2: 29, 3: 24, 4: 21, 5: 21
      },
      '2JO': {
        1: 13
      },
      '3JO': {
        1: 14
      },
      'REV': {
        1: 20, 2: 29, 3: 22, 4: 11, 5: 14, 6: 17, 7: 17, 8: 13, 9: 21, 10: 11,
        11: 19, 12: 17, 13: 18, 14: 20, 15: 8, 16: 21, 17: 18, 18: 24, 19: 21, 20: 15,
        21: 27, 22: 21
      }
    };

    const bookData = verseCounts[book];
    if (bookData && bookData[chapter]) {
      return bookData[chapter];
    }

    // If not found, return a default (this should be rare)
    console.warn(`Verse count not found for ${book} ${chapter}, using default of 50`);
    return 50;
  }

  /**
   * Check if API key is configured
   */
  isApiKeyConfigured(): boolean {
    return !!environment.apiBible?.apiKey;
  }

  /**
   * Test the formatReferenceForApi method with different references
   */
  testFormatReference(reference: string): string | null {
    console.log('Testing formatReferenceForApi with:', reference);
    const result = this.formatReferenceForApi(reference);
    console.log('formatReferenceForApi result:', result);
    return result;
  }

  /**
   * Test API connection with a simple verse
   */
  testApiConnection(): Observable<boolean> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(false));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Test with a simple, well-known verse using the correct format
    const testUrl = `${this.baseUrl}/bibles/${this.bibleId}/passages/Gen.1.1`;
    console.log('Testing API connection with:', testUrl);

    return this.http.get<any>(testUrl, { headers }).pipe(
      map(response => {
        console.log('API test successful:', response);
        return true;
      }),
      catchError(error => {
        console.error('API test failed:', error);
        // Try with a different Bible ID
        return this.tryAlternativeBibleForTest(headers);
      })
    );
  }

  /**
   * Try alternative Bible ID for testing
   */
  private tryAlternativeBibleForTest(headers: HttpHeaders): Observable<boolean> {
    const alternativeBibleId = '65eec8e0b60e656b-01'; // KJV
    const testUrl = `${this.baseUrl}/bibles/${alternativeBibleId}/passages/Gen.1.1`;
    console.log('Trying alternative Bible ID for test:', testUrl);

    return this.http.get<any>(testUrl, { headers }).pipe(
      map(response => {
        console.log('Alternative Bible test successful:', response);
        return true;
      }),
      catchError(error => {
        console.error('Alternative Bible test also failed:', error);
        return from(Promise.resolve(false));
      })
    );
  }

  /**
   * Test different reference formats for a specific passage
   */
  testReferenceFormats(reference: string): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      console.warn('Bible API key not configured');
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // First test with a simple, known working passage
    const simpleTestUrl = `${this.baseUrl}/bibles/${this.bibleId}/passages/Gen.1.1`;
    console.log('First testing simple passage:', simpleTestUrl);

    return this.http.get<any>(simpleTestUrl, { headers }).pipe(
      mergeMap(response => {
        console.log('Simple test successful, API is working');
        // Now test the specific reference
        return this.testSpecificReference(reference, headers);
      }),
      catchError(error => {
        console.error('Simple test failed, API may be down:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test the specific reference with different formats
   */
  private testSpecificReference(reference: string, headers: HttpHeaders): Observable<any> {
    // Test different formats for the specific reference
    const testFormats = [
      // Correct format that the Bible API expects
      'Num.25.10-18',
      'Numbers.25.10-18',
      // Alternative formats to test
      'Num 25:10-18',
      'Numbers 25:10-18',
      'Num.25.10,11,12,13,14,15,16,17,18',
      'Numbers.25.10,11,12,13,14,15,16,17,18',
      // Try individual verses to see if the range is the issue
      'Num.25.10',
      'Numbers.25.10',
      'Num.25.18',
      'Numbers.25.18',
      // Try smaller ranges to see if the issue is with the large range
      'Num.25.10-15',
      'Numbers.25.10-15',
      'Num.25.15-18',
      'Numbers.25.15-18',
      // Try different chapter ranges to see if Numbers 25 exists
      'Num.25.1',
      'Numbers.25.1',
      'Num.25.18',
      'Numbers.25.18',
      // Try the traditional Pinchas reading (Numbers 25:10-26:4)
      'Num.25.10-26.4',
      'Numbers.25.10-26:4',
      // Test individual verses to see which ones exist
      'Num.25.1',
      'Num.25.2',
      'Num.25.3',
      'Num.25.4',
      'Num.25.5',
      'Num.25.6',
      'Num.25.7',
      'Num.25.8',
      'Num.25.9',
      'Num.25.10',
      'Num.25.11',
      'Num.25.12',
      'Num.25.13',
      'Num.25.14',
      'Num.25.15',
      'Num.25.16',
      'Num.25.17',
      'Num.25.18',
      // Test if Numbers book exists at all
      'Numbers.1.1',
      'Numbers.2.1',
      'Numbers.24.1',
      'Numbers.26.1',
      'Numbers.27.1',
      // Test if the issue is with the specific Bible ID
      'Gen.1.1', // This should work as a control
      'Exod.1.1', // Test if other books work
      'Lev.1.1',
      'Deut.1.1'
    ];

    console.log('Testing different reference formats for:', reference);

    // Test each format
    const tests = testFormats.map(format => {
      const url = `${this.baseUrl}/bibles/${this.bibleId}/passages/${encodeURIComponent(format)}`;
      console.log(`Testing format: ${format} -> ${url}`);

      return this.http.get<any>(url, { headers }).pipe(
        map(response => ({ format, success: true, response })),
        catchError(error => {
          console.log(`Format ${format} failed: ${error.status} ${error.statusText}`);
          return from(Promise.resolve({ format, success: false, error }));
        })
      );
    });

    // Return the first successful result
    return from(tests).pipe(
      mergeMap(test => test),
      filter(result => result.success),
      take(1),
      catchError(() => from(Promise.resolve(null)))
    );
  }

  /**
   * Test API configuration and list available Bibles
   */
  testApiConfiguration(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      console.warn('Bible API key not configured');
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    const url = `${this.baseUrl}/bibles`;
    console.log('Testing API configuration with:', url);

    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        console.log('Available Bibles:', response);
        return response;
      }),
      catchError(error => {
        console.error('API configuration test failed:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test with verses endpoint instead of passages
   */
  testVersesEndpoint(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Test with verses endpoint
    const testUrl = `${this.baseUrl}/bibles/${this.bibleId}/verses/Gen.1.1`;
    console.log('Testing verses endpoint with:', testUrl);

    return this.http.get<any>(testUrl, { headers }).pipe(
      map(response => {
        console.log('Verses endpoint test successful:', response);
        return response;
      }),
      catchError(error => {
        console.error('Verses endpoint test failed:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test if Numbers book exists in current Bible ID
   */
  testNumbersBook(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Test if Numbers book exists at all
    const testVerses = [
      'Numbers.1.1',
      'Numbers.2.1',
      'Numbers.24.1',
      'Numbers.25.1',
      'Numbers.26.1',
      'Numbers.27.1'
    ];

    console.log('Testing if Numbers book exists in current Bible ID');

    const tests = testVerses.map(verse => {
      const url = `${this.baseUrl}/bibles/${this.bibleId}/passages/${encodeURIComponent(verse)}`;
      console.log(`Testing verse: ${verse} -> ${url}`);

      return this.http.get<any>(url, { headers }).pipe(
        map(response => ({ verse, success: true, response })),
        catchError(error => {
          console.log(`Verse ${verse} failed: ${error.status} ${error.statusText}`);
          return from(Promise.resolve({ verse, success: false, error }));
        })
      );
    });

    return from(tests).pipe(
      mergeMap(test => test),
      toArray(),
      map(results => {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(`Numbers book test results: ${successful.length} successful, ${failed.length} failed`);
        console.log('Successful verses:', successful.map(r => r.verse));
        console.log('Failed verses:', failed.map(r => r.verse));
        return { successful, failed, results };
      }),
      catchError(error => {
        console.error('Error testing Numbers book:', error);
        return from(Promise.resolve(null));
      })
    );
  }

    /**
   * Find Bible IDs that support Numbers by checking book lists
   */
  findBibleIdsWithNumbers(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // First get all available Bibles
    const url = `${this.baseUrl}/bibles`;
    console.log('Getting all available Bibles to find Numbers support...');

    return this.http.get<any>(url, { headers }).pipe(
      mergeMap(response => {
        if (response && response.data) {
          const bibles = response.data;
          console.log(`Found ${bibles.length} available Bibles`);

          // Test first 20 Bibles by checking their book lists
          const testBibles = bibles.slice(0, 20);
          console.log(`Checking book lists for first ${testBibles.length} Bibles...`);

          const tests = testBibles.map((bible: any) => {
            const booksUrl = `${this.baseUrl}/bibles/${bible.id}/books`;
            console.log(`Checking books for Bible: ${bible.name} (${bible.id})`);

            return this.http.get<any>(booksUrl, { headers }).pipe(
              map(booksResponse => {
                if (booksResponse && booksResponse.data) {
                  const books = booksResponse.data;
                                    const numbersBook = books.find((book: any) =>
                    book.name?.toLowerCase().includes('numbers') ||
                    book.name?.toLowerCase().includes('num') ||
                    book.name?.toLowerCase().includes('NUM') ||
                    book.id?.toLowerCase().includes('num')
                  );

                  if (numbersBook) {
                    console.log(`✅ Bible ${bible.name} supports Numbers (book ID: ${numbersBook.id})`);
                    return {
                      bible,
                      success: true,
                      numbersBook,
                      supportsNumbers: true
                    };
                                    } else {
                    console.log(`❌ Bible ${bible.name} does not have Numbers in its book list`);
                    console.log(`Available books in ${bible.name}:`, books.map((b: any) => `${b.name} (${b.id})`));
                    return {
                      bible,
                      success: false,
                      books: books.map((b: any) => b.name),
                      supportsNumbers: false
                    };
                  }
                } else {
                  console.log(`❌ Bible ${bible.name} - no book data received`);
                  return {
                    bible,
                    success: false,
                    supportsNumbers: false
                  };
                }
              }),
              catchError(error => {
                console.log(`❌ Bible ${bible.name} (${bible.id}) error checking books: ${error.status}`);
                return from(Promise.resolve({
                  bible,
                  success: false,
                  error,
                  supportsNumbers: false
                }));
              })
            );
          });

          return from(tests).pipe(
            mergeMap((test: any) => test),
            toArray(),
            map((results: any[]) => {
              const supportingNumbers = results.filter((r: any) => r.supportsNumbers);
              const notSupportingNumbers = results.filter((r: any) => !r.supportsNumbers);

              console.log(`Numbers support test results: ${supportingNumbers.length} Bibles support Numbers, ${notSupportingNumbers.length} do not`);
              console.log('Bibles that support Numbers:', supportingNumbers.map((r: any) => `${r.bible.name} (${r.bible.id}) - Book ID: ${r.numbersBook?.id}`));
              console.log('Bibles that do not support Numbers:', notSupportingNumbers.map((r: any) => `${r.bible.name} (${r.bible.id})`));

              return {
                supportingNumbers,
                notSupportingNumbers,
                totalTested: testBibles.length,
                totalAvailable: bibles.length
              };
            })
          );
        } else {
          console.error('No Bible data received');
          return from(Promise.resolve(null));
        }
      }),
      catchError(error => {
        console.error('Error finding Bibles with Numbers support:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test KJV Numbers with different abbreviations
   */
  testKJVNumbers(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Test KJV with different Numbers abbreviations
    const testFormats = [
      'NUM.25.10',
      'Numbers.25.10',
      'Num.25.10',
      'NUM.25.10-NUM.25.18',
      'Numbers.25.10-Numbers.25.18'
    ];

    console.log('Testing KJV Numbers with different abbreviations...');

    const tests = testFormats.map(format => {
      const url = `${this.baseUrl}/bibles/65eec8e0b60e656b-01/passages/${encodeURIComponent(format)}`;
      console.log(`Testing KJV format: ${format} -> ${url}`);

      return this.http.get<any>(url, { headers }).pipe(
        map(response => ({ format, success: true, response })),
        catchError(error => {
          console.log(`KJV format ${format} failed: ${error.status} ${error.statusText}`);
          return from(Promise.resolve({ format, success: false, error }));
        })
      );
    });

    return from(tests).pipe(
      mergeMap(test => test),
      toArray(),
      map(results => {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(`KJV Numbers test results: ${successful.length} formats work, ${failed.length} failed`);
        console.log('Working formats:', successful.map(r => r.format));
        console.log('Failed formats:', failed.map(r => r.format));
        return { successful, failed, results };
      }),
      catchError(error => {
        console.error('Error testing KJV Numbers:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test Numbers book across all available Bible IDs
   */
  testNumbersAcrossAllBibleIds(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;
    if (!apiKey) {
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    // Test Numbers 25:10 on all Bible IDs
    const testVerse = 'Numbers.25.10';
    const allBibleIds = [this.bibleId, ...this.alternativeBibleIds];

    console.log('Testing Numbers support across all Bible IDs...');

    const tests = allBibleIds.map(bibleId => {
      const url = `${this.baseUrl}/bibles/${bibleId}/passages/${encodeURIComponent(testVerse)}`;
      console.log(`Testing Bible ID ${bibleId} with ${testVerse} -> ${url}`);

      return this.http.get<any>(url, { headers }).pipe(
        map(response => ({ bibleId, success: true, response })),
        catchError(error => {
          console.log(`Bible ID ${bibleId} failed: ${error.status} ${error.statusText}`);
          return from(Promise.resolve({ bibleId, success: false, error }));
        })
      );
    });

    return from(tests).pipe(
      mergeMap(test => test),
      toArray(),
      map(results => {
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(`Numbers support test results: ${successful.length} Bible IDs support Numbers, ${failed.length} do not`);
        console.log('Bible IDs that support Numbers:', successful.map(r => r.bibleId));
        console.log('Bible IDs that do not support Numbers:', failed.map(r => r.bibleId));
        return { successful, failed, results };
      }),
      catchError(error => {
        console.error('Error testing Numbers across Bible IDs:', error);
        return from(Promise.resolve(null));
      })
    );
  }

  /**
   * Test which Bible IDs are available with the current API key
   */
  testAvailableBibleIds(): Observable<any> {
    const apiKey = environment.apiBible?.apiKey;

    if (!apiKey) {
      console.warn('Bible API key not configured');
      return from(Promise.resolve(null));
    }

    const headers = new HttpHeaders({
      'api-key': apiKey,
      'Content-Type': 'application/json'
    });

    console.log('Testing available Bible IDs...');

    // Test each Bible ID with a simple verse
    const testBibleIds = async () => {
      const results: any[] = [];

      for (const bibleId of this.alternativeBibleIds) {
        const url = `${this.baseUrl}/bibles/${bibleId}/passages/Gen.1.1`;
        console.log(`Testing Bible ID: ${bibleId}`);

        try {
          const response = await this.http.get<any>(url, { headers }).toPromise();
          if (response && response.data) {
            console.log(`✅ Bible ID ${bibleId} works!`);
            results.push({ bibleId, status: 'success', data: response.data });
          } else {
            console.log(`❌ Bible ID ${bibleId} failed - no data`);
            results.push({ bibleId, status: 'failed', error: 'No data' });
          }
        } catch (error: any) {
          console.log(`❌ Bible ID ${bibleId} failed:`, error.status, error.statusText);
          results.push({ bibleId, status: 'failed', error: `${error.status} ${error.statusText}` });
        }
      }

      return results;
    };

    return from(testBibleIds());
  }
}
