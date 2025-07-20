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
    'Bereshit': { book: 'Isaiah', chapter: 42, verseStart: 5, verseEnd: 21, reference: 'ISA.42.5-ISA.42.21' },
    'Noach': { book: 'Isaiah', chapter: 54, verseStart: 9, verseEnd: 10, reference: 'ISA.54.9-ISA.54.10' },
    'Lech Lecha': { book: 'Isaiah', chapter: 40, verseStart: 27, verseEnd: 41, reference: 'ISA.40.27-ISA.40.41' },
    'Vayera': { book: '2 Kings', chapter: 4, verseStart: 1, verseEnd: 37, reference: '2KG.4.1-2KG.4.37' },
    'Chayei Sarah': { book: '1 Kings', chapter: 1, verseStart: 1, verseEnd: 31, reference: '1KG.1.1-1KG.1.31' },
    'Toldot': { book: 'Malachi', chapter: 1, verseStart: 1, verseEnd: 14, reference: 'MAL.1.1-MAL.1.14' },
    'Vayetze': { book: 'Hosea', chapter: 12, verseStart: 12, verseEnd: 14, reference: 'HOS.12.12-HOS.12.14' },
    'Vayishlach': { book: 'Obadiah', chapter: 1, verseStart: 1, verseEnd: 21, reference: 'OBA.1.1-OBA.1.21' },
    'Vayeshev': { book: 'Amos', chapter: 2, verseStart: 6, verseEnd: 3, reference: 'AMO.2.6-AMO.3.8' },
    'Miketz': { book: '1 Kings', chapter: 3, verseStart: 15, verseEnd: 28, reference: '1KG.3.15-1KG.3.28' },
    'Vayigash': { book: 'Ezekiel', chapter: 37, verseStart: 15, verseEnd: 28, reference: 'EZK.37.15-EZK.37.28' },
    'Vayechi': { book: '1 Kings', chapter: 2, verseStart: 1, verseEnd: 12, reference: '1KG.2.1-1KG.2.12' },

    // Exodus (Shemot)
    'Shemot': { book: 'Isaiah', chapter: 27, verseStart: 6, verseEnd: 28, reference: 'ISA.27.6-ISA.28.13' },
    'Vaera': { book: 'Ezekiel', chapter: 28, verseStart: 25, verseEnd: 29, reference: 'EZK.28.25-EZK.29.21' },
    'Bo': { book: 'Jeremiah', chapter: 46, verseStart: 13, verseEnd: 28, reference: 'JER.46.13-JER.46.28' },
    'Beshalach': { book: 'Judges', chapter: 4, verseStart: 4, verseEnd: 5, reference: 'JDG.4.4-JDG.5.31' },
    'Yitro': { book: 'Isaiah', chapter: 6, verseStart: 1, verseEnd: 13, reference: 'ISA.6.1-ISA.6.13' },
    'Mishpatim': { book: 'Jeremiah', chapter: 34, verseStart: 8, verseEnd: 22, reference: 'JER.34.8-JER.34.22' },
    'Terumah': { book: '1 Kings', chapter: 5, verseStart: 26, verseEnd: 6, reference: '1KG.5.26-1KG.6.13' },
    'Tetzaveh': { book: 'Ezekiel', chapter: 43, verseStart: 10, verseEnd: 27, reference: 'EZK.43.10-EZK.43.27' },
    'Ki Tisa': { book: '1 Kings', chapter: 18, verseStart: 1, verseEnd: 39, reference: '1KG.18.1-1KG.18.39' },
    'Vayakhel': { book: '1 Kings', chapter: 7, verseStart: 40, verseEnd: 50, reference: '1KG.7.40-1KG.7.50' },
    'Pekudei': { book: '1 Kings', chapter: 7, verseStart: 51, verseEnd: 8, reference: '1KG.7.51-1KG.8.21' },

    // Leviticus (Vayikra)
    'Vayikra': { book: 'Isaiah', chapter: 43, verseStart: 21, verseEnd: 44, reference: 'ISA.43.21-ISA.44.23' },
    'Tzav': { book: 'Jeremiah', chapter: 7, verseStart: 21, verseEnd: 34, reference: 'JER.7.21-JER.7.34' },
    'Shmini': { book: '2 Samuel', chapter: 6, verseStart: 1, verseEnd: 19, reference: '2SA.6.1-2SA.6.19' },
    'Tazria': { book: '2 Kings', chapter: 4, verseStart: 42, verseEnd: 5, reference: '2KG.4.42-2KG.5.19' },
    'Metzora': { book: '2 Kings', chapter: 7, verseStart: 3, verseEnd: 20, reference: '2KG.7.3-2KG.7.20' },
    'Achrei Mot': { book: 'Ezekiel', chapter: 22, verseStart: 1, verseEnd: 19, reference: 'EZK.22.1-EZK.22.19' },
    'Kedoshim': { book: 'Amos', chapter: 9, verseStart: 7, verseEnd: 15, reference: 'AMO.9.7-AMO.9.15' },
    'Emor': { book: 'Ezekiel', chapter: 44, verseStart: 15, verseEnd: 31, reference: 'EZK.44.15-EZK.44.31' },
    'Behar': { book: 'Jeremiah', chapter: 32, verseStart: 6, verseEnd: 27, reference: 'JER.32.6-JER.32.27' },
    'Bechukotai': { book: 'Jeremiah', chapter: 16, verseStart: 19, verseEnd: 17, reference: 'JER.16.19-JER.17.14' },

    // Numbers (Bamidbar)
    'Bamidbar': { book: 'Hosea', chapter: 2, verseStart: 1, verseEnd: 22, reference: 'HOS.2.1-HOS.2.22' },
    'Nasso': { book: 'Judges', chapter: 13, verseStart: 2, verseEnd: 25, reference: 'JDG.13.2-JDG.13.25' },
    'Beha\'alotcha': { book: 'Zechariah', chapter: 2, verseStart: 14, verseEnd: 4, reference: 'ZEC.2.14-ZEC.4.7' },
    'Sh\'lach': { book: 'Joshua', chapter: 2, verseStart: 1, verseEnd: 24, reference: 'JOS.2.1-JOS.2.24' },
    'Korach': { book: '1 Samuel', chapter: 11, verseStart: 14, verseEnd: 12, reference: '1SA.11.14-1SA.12.22' },
    'Chukat': { book: 'Judges', chapter: 11, verseStart: 1, verseEnd: 33, reference: 'JDG.11.1-JDG.11.33' },
    'Balak': { book: 'Micah', chapter: 5, verseStart: 6, verseEnd: 8, reference: 'MIC.5.6-MIC.5.8' },
    'Pinchas': { book: '1 Kings', chapter: 18, verseStart: 46, verseEnd: 19, reference: '1KG.18.46-1KG.19.21' },
    'Matot': { book: 'Jeremiah', chapter: 1, verseStart: 1, verseEnd: 2, reference: 'JER.1.1-JER.2.3' },
    'Masei': { book: 'Jeremiah', chapter: 2, verseStart: 4, verseEnd: 28, reference: 'JER.2.4-JER.2.28' },

    // Deuteronomy (Devarim)
    'Devarim': { book: 'Isaiah', chapter: 1, verseStart: 1, verseEnd: 27, reference: 'ISA.1.1-ISA.1.27' },
    'Vaetchanan': { book: 'Isaiah', chapter: 40, verseStart: 1, verseEnd: 26, reference: 'ISA.40.1-ISA.40.26' },
    'Eikev': { book: 'Isaiah', chapter: 49, verseStart: 14, verseEnd: 51, reference: 'ISA.49.14-ISA.51.3' },
    'Re\'eh': { book: 'Isaiah', chapter: 54, verseStart: 11, verseEnd: 55, reference: 'ISA.54.11-ISA.55.5' },
    'Shoftim': { book: 'Isaiah', chapter: 51, verseStart: 12, verseEnd: 52, reference: 'ISA.51.12-ISA.52.12' },
    'Ki Teitzei': { book: 'Isaiah', chapter: 54, verseStart: 1, verseEnd: 10, reference: 'ISA.54.1-ISA.54.10' },
    'Ki Tavo': { book: 'Isaiah', chapter: 60, verseStart: 1, verseEnd: 22, reference: 'ISA.60.1-ISA.60.22' },
    'Nitzavim': { book: 'Isaiah', chapter: 61, verseStart: 10, verseEnd: 63, reference: 'ISA.61.10-ISA.63.9' },
    'Vayeilech': { book: 'Hosea', chapter: 14, verseStart: 1, verseEnd: 10, reference: 'HOS.14.1-HOS.14.10' },
    'Ha\'Azinu': { book: '2 Samuel', chapter: 22, verseStart: 1, verseEnd: 51, reference: '2SA.22.1-2SA.22.51' },
    'Vezot Haberachah': { book: 'Joshua', chapter: 1, verseStart: 1, verseEnd: 18, reference: 'JOS.1.1-JOS.1.18' }
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
