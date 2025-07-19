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

    // Common book name mappings for api.bible
    const bookMappings: { [key: string]: string } = {
      'Genesis': 'Gen',
      'Exodus': 'Exod',
      'Leviticus': 'Lev',
      'Numbers': 'NUM',
      'Deuteronomy': 'Deut',
      'Joshua': 'Josh',
      'Judges': 'Judg',
      'Ruth': 'Ruth',
      '1 Samuel': '1Sam',
      '2 Samuel': '2Sam',
      '1 Kings': '1Kgs',
      '2 Kings': '2Kgs',
      '1 Chronicles': '1Chr',
      '2 Chronicles': '2Chr',
      'Ezra': 'Ezra',
      'Nehemiah': 'Neh',
      'Esther': 'Esth',
      'Job': 'Job',
      'Psalms': 'Ps',
      'Psalm': 'Ps',
      'Proverbs': 'Prov',
      'Ecclesiastes': 'Eccl',
      'Song of Solomon': 'Song',
      'Isaiah': 'Isa',
      'Jeremiah': 'Jer',
      'Lamentations': 'Lam',
      'Ezekiel': 'Ezek',
      'Daniel': 'Dan',
      'Hosea': 'Hos',
      'Joel': 'Joel',
      'Amos': 'Amos',
      'Obadiah': 'Obad',
      'Jonah': 'Jonah',
      'Micah': 'Mic',
      'Nahum': 'Nah',
      'Habakkuk': 'Hab',
      'Zephaniah': 'Zeph',
      'Haggai': 'Hag',
      'Zechariah': 'Zech',
      'Malachi': 'Mal',
      'Matthew': 'Matt',
      'Mark': 'Mark',
      'Luke': 'Luke',
      'John': 'John',
      'Acts': 'Acts',
      'Romans': 'Rom',
      '1 Corinthians': '1Cor',
      '2 Corinthians': '2Cor',
      'Galatians': 'Gal',
      'Ephesians': 'Eph',
      'Philippians': 'Phil',
      'Colossians': 'Col',
      '1 Thessalonians': '1Thess',
      '2 Thessalonians': '2Thess',
      '1 Timothy': '1Tim',
      '2 Timothy': '2Tim',
      'Titus': 'Titus',
      'Philemon': 'Phlm',
      'Hebrews': 'Heb',
      'James': 'Jas',
      '1 Peter': '1Pet',
      '2 Peter': '2Pet',
      '1 John': '1John',
      '2 John': '2John',
      '3 John': '3John',
      'Jude': 'Jude',
      'Revelation': 'Rev'
    };

    // Try to match and replace book names
    for (const [fullName, shortName] of Object.entries(bookMappings)) {
      if (formatted.startsWith(fullName + ' ')) {
        formatted = formatted.replace(fullName, shortName);
        break;
      }
    }

    console.log('Formatted reference:', formatted);

    // Ensure proper format (e.g., "Num 25:10-30")
    const match = formatted.match(/^([A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
    if (!match) {
      console.error('Invalid reference format after formatting:', formatted);
      return null;
    }

    // Convert to the format expected by the Bible API
    // The API expects format like "Gen.1.1" or "Gen.1.1-5"
    const book = match[1];
    const chapter = match[2];
    const verseStart = match[3];
    const verseEnd = match[4];

    if (verseEnd) {
      // Range format: "Gen.1.1-Gen.1.5" (Book.Chapter.StartVerse-Book.Chapter.EndVerse)
      return `${book}.${chapter}.${verseStart}-${book}.${chapter}.${verseEnd}`;
    } else {
      // Single verse format: "Gen.1.1"
      return `${book}.${chapter}.${verseStart}`;
    }
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
