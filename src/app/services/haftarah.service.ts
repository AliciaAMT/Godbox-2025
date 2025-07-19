import { Injectable } from '@angular/core';

export interface HaftarahReading {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  reference: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HaftarahService {

  // Comprehensive haftarah mappings for all parashot
  private readonly haftarahMappings: { [key: string]: HaftarahReading } = {
    // Genesis (Bereshit)
    'Bereshit': { book: 'Isaiah', chapter: 42, verseStart: 5, verseEnd: 21, reference: 'Isaiah 42:5-21' },
    'Noach': { book: 'Isaiah', chapter: 54, verseStart: 9, verseEnd: 10, reference: 'Isaiah 54:9-10' },
    'Lech Lecha': { book: 'Isaiah', chapter: 40, verseStart: 27, verseEnd: 41, reference: 'Isaiah 40:27-41' },
    'Vayera': { book: '2 Kings', chapter: 4, verseStart: 1, verseEnd: 37, reference: '2 Kings 4:1-37' },
    'Chayei Sarah': { book: '1 Kings', chapter: 1, verseStart: 1, verseEnd: 31, reference: '1 Kings 1:1-31' },
    'Toldot': { book: 'Malachi', chapter: 1, verseStart: 1, verseEnd: 14, reference: 'Malachi 1:1-14' },
    'Vayetze': { book: 'Hosea', chapter: 12, verseStart: 12, verseEnd: 14, reference: 'Hosea 12:12-14' },
    'Vayishlach': { book: 'Obadiah', chapter: 1, verseStart: 1, verseEnd: 21, reference: 'Obadiah 1:1-21' },
    'Vayeshev': { book: 'Amos', chapter: 2, verseStart: 6, verseEnd: 3, reference: 'Amos 2:6-3:8' },
    'Miketz': { book: '1 Kings', chapter: 3, verseStart: 15, verseEnd: 28, reference: '1 Kings 3:15-28' },
    'Vayigash': { book: 'Ezekiel', chapter: 37, verseStart: 15, verseEnd: 28, reference: 'Ezekiel 37:15-28' },
    'Vayechi': { book: '1 Kings', chapter: 2, verseStart: 1, verseEnd: 12, reference: '1 Kings 2:1-12' },

    // Exodus (Shemot)
    'Shemot': { book: 'Isaiah', chapter: 27, verseStart: 6, verseEnd: 28, reference: 'Isaiah 27:6-28:13' },
    'Vaera': { book: 'Ezekiel', chapter: 28, verseStart: 25, verseEnd: 29, reference: 'Ezekiel 28:25-29:21' },
    'Bo': { book: 'Jeremiah', chapter: 46, verseStart: 13, verseEnd: 28, reference: 'Jeremiah 46:13-28' },
    'Beshalach': { book: 'Judges', chapter: 4, verseStart: 4, verseEnd: 5, reference: 'Judges 4:4-5:31' },
    'Yitro': { book: 'Isaiah', chapter: 6, verseStart: 1, verseEnd: 13, reference: 'Isaiah 6:1-13' },
    'Mishpatim': { book: 'Jeremiah', chapter: 34, verseStart: 8, verseEnd: 22, reference: 'Jeremiah 34:8-22' },
    'Terumah': { book: '1 Kings', chapter: 5, verseStart: 26, verseEnd: 6, reference: '1 Kings 5:26-6:13' },
    'Tetzaveh': { book: 'Ezekiel', chapter: 43, verseStart: 10, verseEnd: 27, reference: 'Ezekiel 43:10-27' },
    'Ki Tisa': { book: '1 Kings', chapter: 18, verseStart: 1, verseEnd: 39, reference: '1 Kings 18:1-39' },
    'Vayakhel': { book: '1 Kings', chapter: 7, verseStart: 40, verseEnd: 50, reference: '1 Kings 7:40-50' },
    'Pekudei': { book: '1 Kings', chapter: 7, verseStart: 51, verseEnd: 8, reference: '1 Kings 7:51-8:21' },

    // Leviticus (Vayikra)
    'Vayikra': { book: 'Isaiah', chapter: 43, verseStart: 21, verseEnd: 44, reference: 'Isaiah 43:21-44:23' },
    'Tzav': { book: 'Jeremiah', chapter: 7, verseStart: 21, verseEnd: 34, reference: 'Jeremiah 7:21-34' },
    'Shmini': { book: '2 Samuel', chapter: 6, verseStart: 1, verseEnd: 19, reference: '2 Samuel 6:1-19' },
    'Tazria': { book: '2 Kings', chapter: 4, verseStart: 42, verseEnd: 5, reference: '2 Kings 4:42-5:19' },
    'Metzora': { book: '2 Kings', chapter: 7, verseStart: 3, verseEnd: 20, reference: '2 Kings 7:3-20' },
    'Achrei Mot': { book: 'Ezekiel', chapter: 22, verseStart: 1, verseEnd: 19, reference: 'Ezekiel 22:1-19' },
    'Kedoshim': { book: 'Amos', chapter: 9, verseStart: 7, verseEnd: 15, reference: 'Amos 9:7-15' },
    'Emor': { book: 'Ezekiel', chapter: 44, verseStart: 15, verseEnd: 31, reference: 'Ezekiel 44:15-31' },
    'Behar': { book: 'Jeremiah', chapter: 32, verseStart: 6, verseEnd: 27, reference: 'Jeremiah 32:6-27' },
    'Bechukotai': { book: 'Jeremiah', chapter: 16, verseStart: 19, verseEnd: 17, reference: 'Jeremiah 16:19-17:14' },

    // Numbers (Bamidbar)
    'Bamidbar': { book: 'Hosea', chapter: 2, verseStart: 1, verseEnd: 22, reference: 'Hosea 2:1-22' },
    'Nasso': { book: 'Judges', chapter: 13, verseStart: 2, verseEnd: 25, reference: 'Judges 13:2-25' },
    'Beha\'alotcha': { book: 'Zechariah', chapter: 2, verseStart: 14, verseEnd: 4, reference: 'Zechariah 2:14-4:7' },
    'Sh\'lach': { book: 'Joshua', chapter: 2, verseStart: 1, verseEnd: 24, reference: 'Joshua 2:1-24' },
    'Korach': { book: '1 Samuel', chapter: 11, verseStart: 14, verseEnd: 12, reference: '1 Samuel 11:14-12:22' },
    'Chukat': { book: 'Judges', chapter: 11, verseStart: 1, verseEnd: 33, reference: 'Judges 11:1-33' },
    'Balak': { book: 'Micah', chapter: 5, verseStart: 6, verseEnd: 8, reference: 'Micah 5:6-8' },
    'Pinchas': { book: '1 Kings', chapter: 18, verseStart: 46, verseEnd: 19, reference: '1 Kings 18:46-19:21' },
    'Matot': { book: 'Jeremiah', chapter: 1, verseStart: 1, verseEnd: 2, reference: 'Jeremiah 1:1-2:3' },
    'Masei': { book: 'Jeremiah', chapter: 2, verseStart: 4, verseEnd: 28, reference: 'Jeremiah 2:4-28' },

    // Deuteronomy (Devarim)
    'Devarim': { book: 'Isaiah', chapter: 1, verseStart: 1, verseEnd: 27, reference: 'Isaiah 1:1-27' },
    'Vaetchanan': { book: 'Isaiah', chapter: 40, verseStart: 1, verseEnd: 26, reference: 'Isaiah 40:1-26' },
    'Eikev': { book: 'Isaiah', chapter: 49, verseStart: 14, verseEnd: 51, reference: 'Isaiah 49:14-51:3' },
    'Re\'eh': { book: 'Isaiah', chapter: 54, verseStart: 11, verseEnd: 55, reference: 'Isaiah 54:11-55:5' },
    'Shoftim': { book: 'Isaiah', chapter: 51, verseStart: 12, verseEnd: 52, reference: 'Isaiah 51:12-52:12' },
    'Ki Teitzei': { book: 'Isaiah', chapter: 54, verseStart: 1, verseEnd: 10, reference: 'Isaiah 54:1-10' },
    'Ki Tavo': { book: 'Isaiah', chapter: 60, verseStart: 1, verseEnd: 22, reference: 'Isaiah 60:1-22' },
    'Nitzavim': { book: 'Isaiah', chapter: 61, verseStart: 10, verseEnd: 63, reference: 'Isaiah 61:10-63:9' },
    'Vayeilech': { book: 'Hosea', chapter: 14, verseStart: 1, verseEnd: 10, reference: 'Hosea 14:1-10' },
    'Ha\'Azinu': { book: '2 Samuel', chapter: 22, verseStart: 1, verseEnd: 51, reference: '2 Samuel 22:1-51' },
    'Vezot Haberachah': { book: 'Joshua', chapter: 1, verseStart: 1, verseEnd: 18, reference: 'Joshua 1:1-18' }
  };

  constructor() { }

  /**
   * Get haftarah reading for a specific parashah
   */
  getHaftarah(parashah: string): HaftarahReading | null {
    return this.haftarahMappings[parashah] || null;
  }

  /**
   * Get haftarah reference string for api.bible
   */
  getHaftarahReference(parashah: string): string {
    const haftarah = this.getHaftarah(parashah);
    return haftarah ? haftarah.reference : '';
  }

  /**
   * Get all available parashot with haftarah readings
   */
  getAvailableParashot(): string[] {
    return Object.keys(this.haftarahMappings);
  }

  /**
   * Check if a parashah has a haftarah reading
   */
  hasHaftarah(parashah: string): boolean {
    return parashah in this.haftarahMappings;
  }

  /**
   * Get haftarah description for a parashah
   */
  getHaftarahDescription(parashah: string): string {
    const haftarah = this.getHaftarah(parashah);
    if (!haftarah) return '';

    return `${haftarah.book} ${haftarah.chapter}:${haftarah.verseStart}-${haftarah.verseEnd}`;
  }
}
