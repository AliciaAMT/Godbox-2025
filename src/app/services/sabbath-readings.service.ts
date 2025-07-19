import { Injectable } from '@angular/core';
import { HebrewCalendar, Location, Event, HDate } from '@hebcal/core';
import { ParashahService, AutomatedReading } from './parashah.service';
import { HaftarahService } from './haftarah.service';
import { ScriptureMappingService } from './scripture-mapping.service';

export interface SabbathReading {
  idNo: number;
  parashat: string;
  parashatHeb: string;
  parashatEng: string;
  sabbathDate: string;
  hebrewDate: string;
  weekReadings: DailyReading[];
  haftarah: string;
  haftarahReference: string;
  completeTorahReading: string;
}

export interface DailyReading {
  day: number;
  dayName: string;
  date: string;
  torahReading: string;
  torahReference: string;
}

@Injectable({
  providedIn: 'root'
})
export class SabbathReadingsService {

  constructor(
    private parashahService: ParashahService,
    private haftarahService: HaftarahService,
    private scriptureMappingService: ScriptureMappingService
  ) { }

  /**
   * Get complete Sabbath readings for a date range
   */
  getSabbathReadings(startDate: Date, endDate: Date): SabbathReading[] {
    const sabbathReadings: SabbathReading[] = [];
    let idNo = 1;
    const processedParashot = new Set<string>(); // Track processed parashot to avoid duplicates

    // Get all parashot events in the date range
    const events = HebrewCalendar.calendar({
      start: startDate,
      end: endDate,
      location: Location.lookup('Jerusalem'),
      sedrot: true,
      candlelighting: false
    });

    // Find all parashot events and sort by date
    const parashotEvents = events
      .filter(event => {
        const desc = event.getDesc();
        return desc && desc.includes('Parashat');
      })
      .sort((a, b) => a.getDate().greg().getTime() - b.getDate().greg().getTime());

    // Generate Sabbath readings for each parashah
    for (const parashahEvent of parashotEvents) {
      const parashat = parashahEvent.basename();
      const parashahStartDate = parashahEvent.getDate().greg();

      // Skip if we've already processed this parashah
      if (processedParashot.has(parashat)) {
        continue;
      }

      // Calculate the Sabbath date (7th day of the week)
      const sabbathDate = new Date(parashahStartDate);
      sabbathDate.setDate(sabbathDate.getDate() + 6); // 7th day (0-indexed, so +6)

      // Only include if Sabbath falls within our date range
      if (sabbathDate >= startDate && sabbathDate <= endDate) {
        const weekReadings = this.generateWeekReadings(parashat, parashahStartDate);
        const haftarahRef = this.haftarahService.getHaftarahReference(parashat);

        // Combine all Torah readings for the complete Sabbath reading
        const completeTorahReading = this.combineTorahReadings(weekReadings);

        const sabbathReading: SabbathReading = {
          idNo: idNo++,
          parashat,
          parashatHeb: this.getParashahHebrew(parashat),
          parashatEng: this.getParashahEnglish(parashat),
          sabbathDate: this.formatDate(sabbathDate),
          hebrewDate: this.getHebrewDate(sabbathDate),
          weekReadings,
          haftarah: haftarahRef,
          haftarahReference: haftarahRef,
          completeTorahReading
        };

        sabbathReadings.push(sabbathReading);
        processedParashot.add(parashat); // Mark as processed
      }
    }

    return sabbathReadings;
  }

  /**
   * Generate daily readings for the week
   */
  private generateWeekReadings(parashah: string, startDate: Date): DailyReading[] {
    const weekReadings: DailyReading[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let day = 0; day < 7; day++) {
      const readingDate = new Date(startDate);
      readingDate.setDate(readingDate.getDate() + day);

      const kriyah = day + 1;
      const scriptureReadings = this.scriptureMappingService.getScriptureReferences(parashah, kriyah);

      const dailyReading: DailyReading = {
        day: kriyah,
        dayName: dayNames[day],
        date: this.formatDate(readingDate),
        torahReading: scriptureReadings?.torah?.reference || '',
        torahReference: scriptureReadings?.torah?.reference || ''
      };

      weekReadings.push(dailyReading);
    }

    return weekReadings;
  }

  /**
   * Combine all Torah readings for the complete Sabbath reading
   */
  private combineTorahReadings(weekReadings: DailyReading[]): string {
    const torahReadings = weekReadings
      .map(reading => reading.torahReading)
      .filter(reading => reading && reading.trim() !== '')
      .join('; ');

    return torahReadings;
  }

  /**
   * Get Hebrew name for parashah
   */
  private getParashahHebrew(parashah: string): string {
    const translations = this.parashahService['parashahTranslations'];
    return translations[parashah]?.heb || parashah;
  }

  /**
   * Get English name for parashah
   */
  private getParashahEnglish(parashah: string): string {
    const translations = this.parashahService['parashahTranslations'];
    return translations[parashah]?.eng || parashah;
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get Hebrew date
   */
  private getHebrewDate(date: Date): string {
    const hDate = new HDate(date);
    return hDate.toString();
  }

  /**
   * Get Sabbath readings for today
   */
  getSabbathReadingsForToday(): SabbathReading[] {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    // Extend range to ensure we capture the current Sabbath
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() + 7);

    return this.getSabbathReadings(startDate, endDate);
  }

  /**
   * Get Sabbath readings for a specific date
   */
  getSabbathReadingsForDate(date: Date): SabbathReading[] {
    const startDate = new Date(date);
    const endDate = new Date(date);

    // Extend range to ensure we capture the Sabbath
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() + 7);

    return this.getSabbathReadings(startDate, endDate);
  }

  /**
   * Get next Sabbath reading
   */
  getNextSabbathReading(): SabbathReading | null {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30); // Look ahead 30 days

    const readings = this.getSabbathReadings(today, endDate);
    return readings.length > 0 ? readings[0] : null;
  }

  /**
   * Get Sabbath reading for a specific parashah
   */
  getSabbathReadingForParashah(parashah: string): SabbathReading | null {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setFullYear(endDate.getFullYear() + 1); // Look ahead 1 year

    const readings = this.getSabbathReadings(today, endDate);
    return readings.find(reading => reading.parashat === parashah) || null;
  }
}
