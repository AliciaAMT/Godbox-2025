import { Injectable } from '@angular/core';
import { HebrewCalendar, Location, Event, HDate } from '@hebcal/core';

export interface AutomatedReading {
  idNo: number;
  parashat: string;
  parashatHeb: string;
  parashatEng: string;
  date: string;
  holiday: string;
  holidayReadings: string;
  holidayDate: string;
  kriyah: number;
  kriyahHeb: string;
  kriyahEng: string;
  kriyahDate: string;
  torah: string;
  prophets: string;
  writings: string;
  britChadashah: string;
  haftarah: string;
  apostles: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParashahService {

  private readonly parashahTranslations: { [key: string]: { heb: string, eng: string } } = {
    'Bereshit': { heb: 'בראשית', eng: 'In the Beginning' },
    'Noach': { heb: 'נח', eng: 'Noah' },
    'Lech Lecha': { heb: 'לך לך', eng: 'Go Forth' },
    'Vayera': { heb: 'וירא', eng: 'He Appeared' },
    'Chayei Sarah': { heb: 'חיי שרה', eng: 'Life of Sarah' },
    'Toldot': { heb: 'תולדות', eng: 'Generations' },
    'Vayetze': { heb: 'ויצא', eng: 'He Went Out' },
    'Vayishlach': { heb: 'וישלח', eng: 'He Sent' },
    'Vayeshev': { heb: 'וישב', eng: 'He Settled' },
    'Miketz': { heb: 'מקץ', eng: 'At the End' },
    'Vayigash': { heb: 'ויגש', eng: 'He Approached' },
    'Vayechi': { heb: 'ויחי', eng: 'He Lived' },
    'Shemot': { heb: 'שמות', eng: 'Names' },
    'Vaera': { heb: 'וארא', eng: 'I Appeared' },
    'Bo': { heb: 'בא', eng: 'Enter!' },
    'Beshalach': { heb: 'בשלח', eng: 'When He Sent' },
    'Yitro': { heb: 'יתרו', eng: 'Jethro' },
    'Mishpatim': { heb: 'משפטים', eng: 'Judgments' },
    'Terumah': { heb: 'תרומה', eng: 'Offering' },
    'Tetzaveh': { heb: 'תצוה', eng: 'You Shall Command' },
    'Ki Tisa': { heb: 'כי תשא', eng: 'When You Take' },
    'Vayakhel': { heb: 'ויקהל', eng: 'And He Assembled' },
    'Pekudei': { heb: 'פקודי', eng: 'Accounts' },
    'Vayikra': { heb: 'ויקרא', eng: 'And He Called' },
    'Tzav': { heb: 'צו', eng: 'Command' },
    'Shmini': { heb: 'שמיני', eng: 'Eighth' },
    'Tazria': { heb: 'תזריע', eng: 'She Bears Seed' },
    'Metzora': { heb: 'מצורע', eng: 'Infected One' },
    'Achrei Mot': { heb: 'אחרי מות', eng: 'After the Death' },
    'Kedoshim': { heb: 'קדושים', eng: 'Holy Ones' },
    'Emor': { heb: 'אמר', eng: 'Say' },
    'Behar': { heb: 'בהר', eng: 'On the Mountain' },
    'Bechukotai': { heb: 'בחקתי', eng: 'By My Regulations' },
    'Bamidbar': { heb: 'במדבר', eng: 'In the Wilderness' },
    'Nasso': { heb: 'נשא', eng: 'Elevate' },
    'Beha\'alotcha': { heb: 'בהעלתך', eng: 'When You Set Up' },
    'Sh\'lach': { heb: 'שלח', eng: 'Send' },
    'Korach': { heb: 'קרח', eng: 'Korach' },
    'Chukat': { heb: 'חקת', eng: 'Regulation' },
    'Balak': { heb: 'בלק', eng: 'Balak' },
    'Pinchas': { heb: 'פינחס', eng: 'Pinchas' },
    'Matot': { heb: 'מטות', eng: 'Tribes' },
    'Masei': { heb: 'מסעי', eng: 'Journeys' },
    'Devarim': { heb: 'דברים', eng: 'Words' },
    'Vaetchanan': { heb: 'ואתחנן', eng: 'And I Pleaded' },
    'Eikev': { heb: 'עקב', eng: 'Because' },
    'Re\'eh': { heb: 'ראה', eng: 'See' },
    'Shoftim': { heb: 'שופטים', eng: 'Judges' },
    'Ki Teitzei': { heb: 'כי תצא', eng: 'When You Go Out' },
    'Ki Tavo': { heb: 'כי תבוא', eng: 'When You Enter' },
    'Nitzavim': { heb: 'נצבים', eng: 'Standing' },
    'Vayeilech': { heb: 'וילך', eng: 'And He Went' },
    'Ha\'Azinu': { heb: 'האזינו', eng: 'Listen' },
    'Vezot Haberachah': { heb: 'וזאת הברכה', eng: 'And this is the blessing' }
  };

  constructor() { }

  /**
   * Generate automated readings for a given date range
   */
  generateReadings(startDate: Date, endDate: Date): AutomatedReading[] {
    const readings: AutomatedReading[] = [];
    let idNo = 1;

    // Get parashot for the date range
    const events = HebrewCalendar.calendar({
      start: startDate,
      end: endDate,
      location: Location.lookup('Jerusalem'),
      sedrot: true,
      candlelighting: false
    });

    // Find all parashot events
    const parashotEvents = events.filter(event => {
      const desc = event.getDesc();
      return desc && desc.includes('Parashat');
    });

    // Generate readings for each parashah
    for (const parashahEvent of parashotEvents) {
      const parashat = parashahEvent.basename();
      const parashahStartDate = parashahEvent.getDate().greg();

      // Generate 7 daily readings for this parashah (Sunday through Saturday)
      for (let day = 0; day < 7; day++) {
        const readingDate = new Date(parashahStartDate);
        readingDate.setDate(readingDate.getDate() + day);

        // Only include readings within our date range
        if (readingDate >= startDate && readingDate <= endDate) {
          const reading = this.createReading(
            idNo++,
            parashat,
            readingDate,
            day + 1, // kriyah 1-7
            parashahEvent
          );
          readings.push(reading);
        }
      }
    }

    return readings;
  }

  /**
   * Create a single reading entry
   */
  private createReading(
    idNo: number,
    parashat: string,
    date: Date,
    kriyah: number,
    event: Event
  ): AutomatedReading {
    const translation = this.parashahTranslations[parashat] || { heb: parashat, eng: parashat };

    return {
      idNo,
      parashat,
      parashatHeb: translation.heb,
      parashatEng: translation.eng,
      date: this.formatDate(date),
      holiday: this.getHoliday(event),
      holidayReadings: this.getHolidayReadings(event),
      holidayDate: this.getHebrewDate(date),
      kriyah,
      kriyahHeb: this.getKriyahHebrew(kriyah),
      kriyahEng: `Reading ${kriyah}`,
      kriyahDate: this.getHebrewDate(date),
      torah: '', // To be filled manually or from another source
      prophets: '', // To be filled manually or from another source
      writings: '', // To be filled manually or from another source
      britChadashah: '', // To be filled manually or from another source
      haftarah: kriyah === 7 ? '' : '', // Only on Shabbat (kriyah 7)
      apostles: '' // To be filled manually or from another source
    };
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get Hebrew date string
   */
  private getHebrewDate(date: Date): string {
    const hDate = new HDate(date);
    const monthName = hDate.getMonthName();
    return `${hDate.getDate()} ${monthName} ${hDate.getFullYear()}`;
  }

  /**
   * Get Hebrew kriyah number
   */
  private getKriyahHebrew(kriyah: number): string {
    const hebrewNumbers = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'];
    return `קריאה ${hebrewNumbers[kriyah - 1] || kriyah}`;
  }

  /**
   * Extract holiday information from event
   */
  private getHoliday(event: Event): string {
    const desc = event.getDesc();
    if (desc && desc !== 'Parashat') {
      return desc;
    }
    return '';
  }

  /**
   * Get holiday readings (placeholder for now)
   */
  private getHolidayReadings(event: Event): string {
    // This would need to be populated from a separate database
    // or API that provides holiday-specific readings
    return '';
  }

    /**
   * Generate TypeScript code for the readings database
   */
  generateTypeScriptCode(readings: AutomatedReading[]): string {
    let code = 'export const KRIYAH: any = {\n';

    readings.forEach(reading => {
      code += `  ${reading.idNo}: {\n`;
      code += `    idNo: ${reading.idNo},\n`;
      code += `    parashat: "${this.escapeForDoubleQuotes(reading.parashat)}",\n`;
      code += `    parashatHeb: "${this.escapeForDoubleQuotes(reading.parashatHeb)}",\n`;
      code += `    parashatEng: "${this.escapeForDoubleQuotes(reading.parashatEng)}",\n`;
      code += `    date: "${reading.date}",\n`;
      code += `    holiday: "${this.escapeForDoubleQuotes(reading.holiday)}",\n`;
      code += `    holidayReadings: "${this.escapeForDoubleQuotes(reading.holidayReadings)}",\n`;
      code += `    holidayDate: "${this.escapeForDoubleQuotes(reading.holidayDate)}",\n`;
      code += `    kriyah: ${reading.kriyah},\n`;
      code += `    kriyahHeb: "${this.escapeForDoubleQuotes(reading.kriyahHeb)}",\n`;
      code += `    kriyahEng: "${this.escapeForDoubleQuotes(reading.kriyahEng)}",\n`;
      code += `    kriyahDate: "${this.escapeForDoubleQuotes(reading.kriyahDate)}",\n`;
      code += `    torah: "${this.escapeForDoubleQuotes(reading.torah)}",\n`;
      code += `    prophets: "${this.escapeForDoubleQuotes(reading.prophets)}",\n`;
      code += `    writings: "${this.escapeForDoubleQuotes(reading.writings)}",\n`;
      code += `    britChadashah: "${this.escapeForDoubleQuotes(reading.britChadashah)}",\n`;
      code += `    haftarah: "${this.escapeForDoubleQuotes(reading.haftarah)}",\n`;
      code += `    apostles: "${this.escapeForDoubleQuotes(reading.apostles)}"\n`;
      code += `  },\n`;
    });

    code += '};\n';
    return code;
  }

  /**
   * Generate a complete database file content
   */
  generateDatabaseFile(readings: AutomatedReading[]): string {
    let code = 'export const KRIYAH: any = {\n';

    readings.forEach(reading => {
      code += `  ${reading.idNo}: {\n`;
      code += `    idNo: ${reading.idNo},\n`;
      code += `    parashat: "${this.escapeForDoubleQuotes(reading.parashat)}",\n`;
      code += `    parashatHeb: "${this.escapeForDoubleQuotes(reading.parashatHeb)}",\n`;
      code += `    parashatEng: "${this.escapeForDoubleQuotes(reading.parashatEng)}",\n`;
      code += `    date: "${reading.date}",\n`;
      code += `    holiday: "${this.escapeForDoubleQuotes(reading.holiday)}",\n`;
      code += `    holidayReadings: "${this.escapeForDoubleQuotes(reading.holidayReadings)}",\n`;
      code += `    holidayDate: "${this.escapeForDoubleQuotes(reading.holidayDate)}",\n`;
      code += `    kriyah: ${reading.kriyah},\n`;
      code += `    kriyahHeb: "${this.escapeForDoubleQuotes(reading.kriyahHeb)}",\n`;
      code += `    kriyahEng: "${this.escapeForDoubleQuotes(reading.kriyahEng)}",\n`;
      code += `    kriyahDate: "${this.escapeForDoubleQuotes(reading.kriyahDate)}",\n`;
      code += `    torah: "${this.escapeForDoubleQuotes(reading.torah)}",\n`;
      code += `    prophets: "${this.escapeForDoubleQuotes(reading.prophets)}",\n`;
      code += `    writings: "${this.escapeForDoubleQuotes(reading.writings)}",\n`;
      code += `    britChadashah: "${this.escapeForDoubleQuotes(reading.britChadashah)}",\n`;
      code += `    haftarah: "${this.escapeForDoubleQuotes(reading.haftarah)}",\n`;
      code += `    apostles: "${this.escapeForDoubleQuotes(reading.apostles)}"\n`;
      code += `  },\n`;
    });

    code += '};\n';
    return code;
  }

  /**
   * Convert automated readings to Firebase format
   */
  convertToFirebaseReadings(readings: AutomatedReading[]): any[] {
    return readings.map(reading => ({
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
  }

  /**
   * Escape string for double quotes in TypeScript
   */
  private escapeForDoubleQuotes(str: string): string {
    if (!str) return '';
    return str
      .replace(/"/g, '\\"')  // Escape double quotes
      .replace(/'/g, "\\'")  // Escape single quotes/apostrophes
      .replace(/\n/g, '\\n') // Escape newlines
      .replace(/\r/g, '\\r') // Escape carriage returns
      .replace(/\t/g, '\\t'); // Escape tabs
  }

  /**
   * Escape string for TypeScript string literal
   */
  private escapeString(str: string): string {
    if (!str) return '';
    return str.replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
  }
}
