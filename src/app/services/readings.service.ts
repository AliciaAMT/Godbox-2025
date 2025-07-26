import { Injectable } from '@angular/core';
import { HebrewCalendar, Location, HDate } from '@hebcal/core';
import * as leyning from '@hebcal/leyning';

export interface TorahReading {
  book: string;
  start: string;
  end: string;
  verses: number;
}

export interface DailyReadings {
  date: string;
  parashah?: string;
  torah?: TorahReading;
  haftarah?: string;
  writings?: string;
  prophets?: string;
  britChadashah?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReadingsService {

  constructor() { }

    /**
   * Get daily readings for a specific date
   */
  getDailyReadings(date: Date): DailyReadings {
    const dateString = date.toISOString().split('T')[0];
    const hdate = new HDate(date);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

    const readings: DailyReadings = {
      date: dateString
    };

    try {
      // Check if today is Rosh Chodesh
      const isRoshChodesh = this.isRoshChodesh(date);

      // Get the parashah for this week by finding the Saturday of this week
      const parashah = this.getParashahForWeek(date);
      if (parashah) {
        readings.parashah = parashah;

        // Get Torah and Haftarah readings from hebCal
        const leyningData = leyning.getLeyningForParsha(parashah);

        if (leyningData) {
          // Get daily Torah reading based on day of week
          if (dayOfWeek === 6) {
            // Sabbath - get the full parashah summary
            readings.torah = {
              book: leyningData.summary.split(' ')[0],
              start: leyningData.summary.split(' ')[1].split('-')[0],
              end: leyningData.summary.split(' ')[1].split('-')[1],
              verses: 0 // We'll calculate this if needed
            };

            // Get Haftarah for Sabbath
            if (leyningData.haftara) {
              readings.haftarah = leyningData.haftara;
            }
          } else {
            // Weekday - get specific aliyah for that day
            const aliyahNumber = dayOfWeek + 1; // Sunday = 1, Monday = 2, etc.
            const aliyah = leyningData.weekday?.[aliyahNumber] || leyningData.fullkriyah?.[aliyahNumber];

            if (aliyah) {
              readings.torah = {
                book: aliyah.k,
                start: aliyah.b,
                end: aliyah.e,
                verses: aliyah.v || 0
              };
            }
          }
        }
      }

      // If it's Rosh Chodesh, mark it as such but keep the regular readings
      if (isRoshChodesh) {
        readings.parashah = 'Rosh Chodesh';
        console.log('🔍 Rosh Chodesh detected - regular readings preserved, holiday readings will be shown separately');
      }

      // Get Writings and Prophets from Tanakh Yomi (we'll implement this next)
      const tanakhReadings = this.getTanakhReadings(hdate);
      console.log('Tanakh readings result:', tanakhReadings);
      if (tanakhReadings) {
        readings.writings = tanakhReadings.writings;
        readings.prophets = tanakhReadings.prophets;
        console.log('Set writings to:', readings.writings);
        console.log('Set prophets to:', readings.prophets);
      } else {
        console.log('No Tanakh readings found');
      }

      // Get Brit Chadashah readings (we'll implement this mapping)
      const britChadashah = this.getBritChadashahReading(date);
      if (britChadashah) {
        readings.britChadashah = britChadashah;
      }

    } catch (error) {
      console.error('Error getting daily readings:', error);
    }

    return readings;
  }

  /**
   * Check if a date is Rosh Chodesh (New Moon)
   */
  private isRoshChodesh(date: Date): boolean {
    try {
      const hdate = new HDate(date);
      const events = HebrewCalendar.calendar({
        start: date,
        end: date,
        sedrot: true,
        candlelighting: false
      });

      // Check if any event is Rosh Chodesh
      const roshChodeshEvent = events.find((event: any) => {
        const desc = event.getDesc();
        return desc && desc.includes('Rosh Chodesh');
      });

      return !!roshChodeshEvent;
    } catch (error) {
      console.error('Error checking Rosh Chodesh:', error);
      return false;
    }
  }

    /**
   * Get the parashah for a specific date
   */
  private getParashahForDate(hdate: HDate): string | null {
    try {
      // Get calendar events for the date
      const date = hdate.greg();
      const events = HebrewCalendar.calendar({
        start: date,
        end: date,
        location: Location.lookup('Jerusalem'),
        sedrot: true
      });

      // Find parashah event
      const parashahEvent = events.find(event =>
        event.getDesc().includes('Parashat')
      );

      if (parashahEvent) {
        const desc = parashahEvent.getDesc();
        return desc.replace('Parashat ', '');
      }

      return null;
    } catch (error) {
      console.error('Error getting parashah for date:', error);
      return null;
    }
  }

  /**
   * Get the parashah for the week containing the given date
   */
  private getParashahForWeek(date: Date): string | null {
    try {
      // Find the Saturday of this week
      const dayOfWeek = date.getDay();
      const daysToSaturday = (6 - dayOfWeek + 7) % 7;
      const saturdayDate = new Date(date);
      saturdayDate.setDate(date.getDate() + daysToSaturday);

      // Get calendar events for the Saturday
      const events = HebrewCalendar.calendar({
        start: saturdayDate,
        end: saturdayDate,
        location: Location.lookup('Jerusalem'),
        sedrot: true
      });

      // Find parashah event
      const parashahEvent = events.find(event =>
        event.getDesc().includes('Parashat')
      );

      if (parashahEvent) {
        const desc = parashahEvent.getDesc();
        return desc.replace('Parashat ', '');
      }

      return null;
    } catch (error) {
      console.error('Error getting parashah for week:', error);
      return null;
    }
  }

  /**
   * Get Tanakh Yomi readings (Writings and Prophets)
   * Uses the schedule from the existing scripts
   */
  private getTanakhReadings(hdate: HDate): { writings?: string; prophets?: string } | null {
    try {
      const date = hdate.greg();
      const dateString = date.toISOString().split('T')[0];
      console.log('Getting Tanakh readings for date:', dateString);

      // Get writings reading
      const writings = this.getWritingsReading(date);
      console.log('Writings reading:', writings);

      // Get prophets reading
      const prophets = this.getProphetsReading(date);
      console.log('Prophets reading:', prophets);

      const result = {
        writings: writings || undefined,
        prophets: prophets || undefined
      };
      console.log('Returning Tanakh readings:', result);
      return result;
    } catch (error) {
      console.error('Error getting Tanakh Yomi readings:', error);
      return null;
    }
  }

  /**
   * Get Writings reading for a date
   */
  private getWritingsReading(date: Date): string | null {
    console.log('Getting writings reading for date:', date.toISOString().split('T')[0]);

    try {
      // Writings books in the correct order
      const WRITINGS_BOOKS = [
        { name: 'Psalms', chapters: 150 },
        { name: 'Proverbs', chapters: 31 },
        { name: 'Ecclesiastes', chapters: 12 },
        { name: 'Song of Songs', chapters: 8 },
        { name: '1 Chronicles', chapters: 29 },
        { name: '2 Chronicles', chapters: 36 },
        { name: 'Job', chapters: 42 },
        { name: 'Ezra', chapters: 10 },
        { name: 'Nehemiah', chapters: 13 },
        { name: 'Daniel', chapters: 12 }
      ];

      // Major holidays to skip (these have special readings)
      const HOLIDAYS_TO_SKIP = [
        'Rosh Hashanah',
        'Yom Kippur',
        'Sukkot',
        'Simchat Torah',
        'Shemini Atzeret',
        'Pesach',
        'Shavuot',
        'Purim',
        'Chanukah',
        'Tu BiShvat',
        'Tisha B\'Av',
        'Lag BaOmer',
        'Yom HaAtzmaut',
        'Yom HaZikaron'
      ];

      // Check if this is a holiday
      const events = HebrewCalendar.calendar({
        start: date,
        end: date,
        location: Location.lookup('Jerusalem'),
        sedrot: true
      });

      const holidayEvent = events.find(event => {
        const desc = event.getDesc();
        return HOLIDAYS_TO_SKIP.some(holiday => desc && desc.includes(holiday));
      });

      if (holidayEvent) {
        console.log('Writings calculation - skipping due to holiday:', holidayEvent.getDesc());
        return null; // Skip writings on holidays
      } else {
        console.log('Writings calculation - no holiday detected, continuing');
      }

      // Find the next Simchat Torah to calculate days since last cycle start
      const currentYear = date.getFullYear();
      console.log('Writings calculation - current year:', currentYear);

      // Get Simchat Torah dates for current year and previous year
      const currentYearDates = this.getSimchatTorahDates(currentYear);
      const previousYearDates = this.getSimchatTorahDates(currentYear - 1);
      const simchatTorahDates = [...previousYearDates, ...currentYearDates];

      if (simchatTorahDates.length === 0) {
        console.log('Writings calculation - no Simchat Torah dates found');
        return null;
      } else {
        console.log('Writings calculation - found Simchat Torah dates:', simchatTorahDates);
      }

      // Find the most recent Simchat Torah before this date
      let lastSimchatTorah = null;
      for (const simchatDate of simchatTorahDates) {
        if (simchatDate <= date) {
          lastSimchatTorah = simchatDate;
        } else {
          break;
        }
      }

      if (!lastSimchatTorah) {
        console.log('Writings calculation - no Simchat Torah found before date');
        return null; // Writings haven't started yet
      }

      console.log('Writings calculation - last Simchat Torah:', lastSimchatTorah.toISOString().split('T')[0]);

      // Calculate days since last Simchat Torah
      const daysSinceSimchatTorah = Math.floor((date.getTime() - lastSimchatTorah.getTime()) / (1000 * 60 * 60 * 24));
      console.log('Writings calculation - days since Simchat Torah:', daysSinceSimchatTorah);

      if (daysSinceSimchatTorah <= 0) {
        console.log('Writings calculation - still on Simchat Torah');
        return null; // Still on Simchat Torah
      }

      // Calculate the current reading
      let currentBookIndex = 0;
      let currentChapter = 1;
      let dayCounter = 0;

      // Find the current reading by counting through all books
      for (let bookIndex = 0; bookIndex < WRITINGS_BOOKS.length; bookIndex++) {
        const book = WRITINGS_BOOKS[bookIndex];

        for (let chapter = 1; chapter <= book.chapters; chapter++) {
          dayCounter++;

          if (dayCounter === daysSinceSimchatTorah) {
            const reading = `${book.name} ${chapter}`;
            console.log('Writings calculation - found reading:', reading);
            return reading;
          }
        }
      }

      // If we've gone through all books, start over
      const adjustedDay = ((daysSinceSimchatTorah - 1) % 362) + 1; // 362 total chapters
      dayCounter = 0;

      for (let bookIndex = 0; bookIndex < WRITINGS_BOOKS.length; bookIndex++) {
        const book = WRITINGS_BOOKS[bookIndex];

        for (let chapter = 1; chapter <= book.chapters; chapter++) {
          dayCounter++;

          if (dayCounter === adjustedDay) {
            const reading = `${book.name} ${chapter}`;
            console.log('Writings calculation - found reading (adjusted):', reading);
            return reading;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error in getWritingsReading:', error);
      return null;
    }
  }

  /**
   * Get Prophets reading for a date
   */
  private getProphetsReading(date: Date): string | null {
    console.log('Getting prophets reading for date:', date.toISOString().split('T')[0]);
    // Neviim schedule (first 200 days as example)
    const NEVIIM_SCHEDULE = [
      { day: 1, reading: "Joshua 1" },
      { day: 2, reading: "Joshua 2" },
      { day: 3, reading: "Joshua 3" },
      { day: 4, reading: "Joshua 4" },
      { day: 5, reading: "Joshua 5" },
      { day: 6, reading: "Joshua 6" },
      { day: 7, reading: "Joshua 7" },
      { day: 8, reading: "Joshua 8" },
      { day: 9, reading: "Joshua 9" },
      { day: 10, reading: "Joshua 10–11" },
      { day: 11, reading: "Joshua 12" },
      { day: 12, reading: "Joshua 13" },
      { day: 13, reading: "Joshua 14" },
      { day: 14, reading: "Joshua 15" },
      { day: 15, reading: "Joshua 16" },
      { day: 16, reading: "Joshua 17" },
      { day: 17, reading: "Joshua 18" },
      { day: 18, reading: "Joshua 19" },
      { day: 19, reading: "Joshua 20–21" },
      { day: 20, reading: "Joshua 22" },
      { day: 21, reading: "Joshua 23" },
      { day: 22, reading: "Joshua 24" },
      { day: 23, reading: "Judges 1" },
      { day: 24, reading: "Judges 2" },
      { day: 25, reading: "Judges 3" },
      { day: 26, reading: "Judges 4" },
      { day: 27, reading: "Judges 5" },
      { day: 28, reading: "Judges 6" },
      { day: 29, reading: "Judges 7" },
      { day: 30, reading: "Judges 8" },
      { day: 31, reading: "Judges 9" },
      { day: 32, reading: "Judges 10–11" },
      { day: 33, reading: "Judges 12" },
      { day: 34, reading: "Judges 13" },
      { day: 35, reading: "Judges 14" },
      { day: 36, reading: "Judges 15" },
      { day: 37, reading: "Judges 16" },
      { day: 38, reading: "Judges 17" },
      { day: 39, reading: "Judges 18" },
      { day: 40, reading: "Judges 19" },
      { day: 41, reading: "Judges 20–21" },
      { day: 42, reading: "1 Samuel 1" },
      { day: 43, reading: "1 Samuel 2" },
      { day: 44, reading: "1 Samuel 3" },
      { day: 45, reading: "1 Samuel 4" },
      { day: 46, reading: "1 Samuel 5" },
      { day: 47, reading: "1 Samuel 6" },
      { day: 48, reading: "1 Samuel 7" },
      { day: 49, reading: "1 Samuel 8" },
      { day: 50, reading: "1 Samuel 9" },
      { day: 51, reading: "1 Samuel 10–11" },
      { day: 52, reading: "1 Samuel 12" },
      { day: 53, reading: "1 Samuel 13" },
      { day: 54, reading: "1 Samuel 14" },
      { day: 55, reading: "1 Samuel 15" },
      { day: 56, reading: "1 Samuel 16" },
      { day: 57, reading: "1 Samuel 17" },
      { day: 58, reading: "1 Samuel 18" },
      { day: 59, reading: "1 Samuel 19" },
      { day: 60, reading: "1 Samuel 20–21" },
      { day: 61, reading: "1 Samuel 22" },
      { day: 62, reading: "1 Samuel 23" },
      { day: 63, reading: "1 Samuel 24" },
      { day: 64, reading: "1 Samuel 25" },
      { day: 65, reading: "1 Samuel 26" },
      { day: 66, reading: "1 Samuel 27" },
      { day: 67, reading: "1 Samuel 28" },
      { day: 68, reading: "1 Samuel 29" },
      { day: 69, reading: "1 Samuel 30–31" },
      { day: 70, reading: "2 Samuel 1" },
      { day: 71, reading: "2 Samuel 2" },
      { day: 72, reading: "2 Samuel 3" },
      { day: 73, reading: "2 Samuel 4" },
      { day: 74, reading: "2 Samuel 5" },
      { day: 75, reading: "2 Samuel 6" },
      { day: 76, reading: "2 Samuel 7" },
      { day: 77, reading: "2 Samuel 8" },
      { day: 78, reading: "2 Samuel 9" },
      { day: 79, reading: "2 Samuel 10–11" },
      { day: 80, reading: "2 Samuel 12" },
      { day: 81, reading: "2 Samuel 13" },
      { day: 82, reading: "2 Samuel 14" },
      { day: 83, reading: "2 Samuel 15" },
      { day: 84, reading: "2 Samuel 16" },
      { day: 85, reading: "2 Samuel 17" },
      { day: 86, reading: "2 Samuel 18" },
      { day: 87, reading: "2 Samuel 19" },
      { day: 88, reading: "2 Samuel 20–21" },
      { day: 89, reading: "2 Samuel 22" },
      { day: 90, reading: "2 Samuel 23" },
      { day: 91, reading: "2 Samuel 24" },
      { day: 92, reading: "1 Kings 1" },
      { day: 93, reading: "1 Kings 2" },
      { day: 94, reading: "1 Kings 3" },
      { day: 95, reading: "1 Kings 4" },
      { day: 96, reading: "1 Kings 5" },
      { day: 97, reading: "1 Kings 6" },
      { day: 98, reading: "1 Kings 7" },
      { day: 99, reading: "1 Kings 8" },
      { day: 100, reading: "1 Kings 9" },
      { day: 101, reading: "1 Kings 10–11" },
      { day: 102, reading: "1 Kings 12" },
      { day: 103, reading: "1 Kings 13" },
      { day: 104, reading: "1 Kings 14" },
      { day: 105, reading: "1 Kings 15" },
      { day: 106, reading: "1 Kings 16" },
      { day: 107, reading: "1 Kings 17" },
      { day: 108, reading: "1 Kings 18" },
      { day: 109, reading: "1 Kings 19" },
      { day: 110, reading: "1 Kings 20–21" },
      { day: 111, reading: "1 Kings 22" },
      { day: 112, reading: "2 Kings 1" },
      { day: 113, reading: "2 Kings 2" },
      { day: 114, reading: "2 Kings 3" },
      { day: 115, reading: "2 Kings 4" },
      { day: 116, reading: "2 Kings 5" },
      { day: 117, reading: "2 Kings 6" },
      { day: 118, reading: "2 Kings 7" },
      { day: 119, reading: "2 Kings 8" },
      { day: 120, reading: "2 Kings 9" },
      { day: 121, reading: "2 Kings 10–11" },
      { day: 122, reading: "2 Kings 12" },
      { day: 123, reading: "2 Kings 13" },
      { day: 124, reading: "2 Kings 14" },
      { day: 125, reading: "2 Kings 15" },
      { day: 126, reading: "2 Kings 16" },
      { day: 127, reading: "2 Kings 17" },
      { day: 128, reading: "2 Kings 18" },
      { day: 129, reading: "2 Kings 19" },
      { day: 130, reading: "2 Kings 20–21" },
      { day: 131, reading: "2 Kings 22" },
      { day: 132, reading: "2 Kings 23" },
      { day: 133, reading: "2 Kings 24" },
      { day: 134, reading: "2 Kings 25" },
      { day: 135, reading: "Isaiah 1" },
      { day: 136, reading: "Isaiah 2" },
      { day: 137, reading: "Isaiah 3" },
      { day: 138, reading: "Isaiah 4" },
      { day: 139, reading: "Isaiah 5" },
      { day: 140, reading: "Isaiah 6" },
      { day: 141, reading: "Isaiah 7" },
      { day: 142, reading: "Isaiah 8" },
      { day: 143, reading: "Isaiah 9" },
      { day: 144, reading: "Isaiah 10–11" },
      { day: 145, reading: "Isaiah 12" },
      { day: 146, reading: "Isaiah 13" },
      { day: 147, reading: "Isaiah 14" },
      { day: 148, reading: "Isaiah 15" },
      { day: 149, reading: "Isaiah 16" },
      { day: 150, reading: "Isaiah 17" },
      { day: 151, reading: "Isaiah 18" },
      { day: 152, reading: "Isaiah 19" },
      { day: 153, reading: "Isaiah 20–21" },
      { day: 154, reading: "Isaiah 22" },
      { day: 155, reading: "Isaiah 23" },
      { day: 156, reading: "Isaiah 24" },
      { day: 157, reading: "Isaiah 25" },
      { day: 158, reading: "Isaiah 26" },
      { day: 159, reading: "Isaiah 27" },
      { day: 160, reading: "Isaiah 28" },
      { day: 161, reading: "Isaiah 29" },
      { day: 162, reading: "Isaiah 30–31" },
      { day: 163, reading: "Isaiah 32" },
      { day: 164, reading: "Isaiah 33" },
      { day: 165, reading: "Isaiah 34" },
      { day: 166, reading: "Isaiah 35" },
      { day: 167, reading: "Isaiah 36" },
      { day: 168, reading: "Isaiah 37" },
      { day: 169, reading: "Isaiah 38" },
      { day: 170, reading: "Isaiah 39" },
      { day: 171, reading: "Isaiah 40–41" },
      { day: 172, reading: "Isaiah 42" },
      { day: 173, reading: "Isaiah 43" },
      { day: 174, reading: "Isaiah 44" },
      { day: 175, reading: "Isaiah 45" },
      { day: 176, reading: "Isaiah 46" },
      { day: 177, reading: "Isaiah 47" },
      { day: 178, reading: "Isaiah 48" },
      { day: 179, reading: "Isaiah 49" },
      { day: 180, reading: "Isaiah 50–51" },
      { day: 181, reading: "Isaiah 52" },
      { day: 182, reading: "Isaiah 53" },
      { day: 183, reading: "Isaiah 54" },
      { day: 184, reading: "Isaiah 55" },
      { day: 185, reading: "Isaiah 56" },
      { day: 186, reading: "Isaiah 57" },
      { day: 187, reading: "Isaiah 58" },
      { day: 188, reading: "Isaiah 59" },
      { day: 189, reading: "Isaiah 60–61" },
      { day: 190, reading: "Isaiah 62" },
      { day: 191, reading: "Isaiah 63" },
      { day: 192, reading: "Isaiah 64" },
      { day: 193, reading: "Isaiah 65" },
      { day: 194, reading: "Isaiah 66" },
      { day: 195, reading: "Jeremiah 1" },
      { day: 196, reading: "Jeremiah 2" },
      { day: 197, reading: "Jeremiah 3" },
      { day: 198, reading: "Jeremiah 4" },
      { day: 199, reading: "Jeremiah 5" },
      { day: 200, reading: "Jeremiah 6" },
      { day: 201, reading: "Jeremiah 7" },
      { day: 202, reading: "Jeremiah 8" },
      { day: 203, reading: "Jeremiah 9" },
      { day: 204, reading: "Jeremiah 10" },
      { day: 205, reading: "Jeremiah 11" },
      { day: 206, reading: "Jeremiah 12" },
      { day: 207, reading: "Jeremiah 13" },
      { day: 208, reading: "Jeremiah 14" },
      { day: 209, reading: "Jeremiah 15" },
      { day: 210, reading: "Jeremiah 16" },
      { day: 211, reading: "Jeremiah 17" },
      { day: 212, reading: "Jeremiah 18" },
      { day: 213, reading: "Jeremiah 19" },
      { day: 214, reading: "Jeremiah 20" },
      { day: 215, reading: "Jeremiah 21" },
      { day: 216, reading: "Jeremiah 22" },
      { day: 217, reading: "Jeremiah 23" },
      { day: 218, reading: "Jeremiah 24" },
      { day: 219, reading: "Jeremiah 25" },
      { day: 220, reading: "Jeremiah 26" },
      { day: 221, reading: "Jeremiah 27" },
      { day: 222, reading: "Jeremiah 28" },
      { day: 223, reading: "Jeremiah 29" },
      { day: 224, reading: "Jeremiah 30" },
      { day: 225, reading: "Jeremiah 31" },
      { day: 226, reading: "Jeremiah 32" },
      { day: 227, reading: "Jeremiah 33" },
      { day: 228, reading: "Jeremiah 34" },
      { day: 229, reading: "Jeremiah 35" },
      { day: 230, reading: "Jeremiah 36" },
      { day: 231, reading: "Jeremiah 37" },
      { day: 232, reading: "Jeremiah 38" },
      { day: 233, reading: "Jeremiah 39" },
      { day: 234, reading: "Jeremiah 40" },
      { day: 235, reading: "Jeremiah 41" },
      { day: 236, reading: "Jeremiah 42" },
      { day: 237, reading: "Jeremiah 43" },
      { day: 238, reading: "Jeremiah 44" },
      { day: 239, reading: "Jeremiah 45" },
      { day: 240, reading: "Jeremiah 46" },
      { day: 241, reading: "Jeremiah 47" },
      { day: 242, reading: "Jeremiah 48" },
      { day: 243, reading: "Jeremiah 49" },
      { day: 244, reading: "Jeremiah 50" },
      { day: 245, reading: "Jeremiah 51" },
      { day: 246, reading: "Jeremiah 52" },
      { day: 247, reading: "Ezekiel 1" },
      { day: 248, reading: "Ezekiel 2" },
      { day: 249, reading: "Ezekiel 3" },
      { day: 250, reading: "Ezekiel 4" },
      { day: 251, reading: "Ezekiel 5" },
      { day: 252, reading: "Ezekiel 6" },
      { day: 253, reading: "Ezekiel 7" },
      { day: 254, reading: "Ezekiel 8" },
      { day: 255, reading: "Ezekiel 9" },
      { day: 256, reading: "Ezekiel 10" },
      { day: 257, reading: "Ezekiel 11" },
      { day: 258, reading: "Ezekiel 12" },
      { day: 259, reading: "Ezekiel 13" },
      { day: 260, reading: "Ezekiel 14" },
      { day: 261, reading: "Ezekiel 15" },
      { day: 262, reading: "Ezekiel 16" },
      { day: 263, reading: "Ezekiel 17" },
      { day: 264, reading: "Ezekiel 18" },
      { day: 265, reading: "Ezekiel 19" },
      { day: 266, reading: "Ezekiel 20" },
      { day: 267, reading: "Ezekiel 21" },
      { day: 268, reading: "Ezekiel 22" },
      { day: 269, reading: "Ezekiel 23" },
      { day: 270, reading: "Ezekiel 24" },
      { day: 271, reading: "Ezekiel 25" },
      { day: 272, reading: "Ezekiel 26" },
      { day: 273, reading: "Ezekiel 27" },
      { day: 274, reading: "Ezekiel 28" },
      { day: 275, reading: "Ezekiel 29" },
      { day: 276, reading: "Ezekiel 30" },
      { day: 277, reading: "Ezekiel 31" },
      { day: 278, reading: "Ezekiel 32" },
      { day: 279, reading: "Ezekiel 33" },
      { day: 280, reading: "Ezekiel 34" },
      { day: 281, reading: "Ezekiel 35" },
      { day: 282, reading: "Ezekiel 36" },
      { day: 283, reading: "Ezekiel 37" },
      { day: 284, reading: "Ezekiel 38" },
      { day: 285, reading: "Ezekiel 39" },
      { day: 286, reading: "Ezekiel 40" },
      { day: 287, reading: "Ezekiel 41" },
      { day: 288, reading: "Ezekiel 42" },
      { day: 289, reading: "Ezekiel 43" },
      { day: 290, reading: "Ezekiel 44" },
      { day: 291, reading: "Ezekiel 45" },
      { day: 292, reading: "Ezekiel 46" },
      { day: 293, reading: "Ezekiel 47" },
      { day: 294, reading: "Ezekiel 48" },
      { day: 295, reading: "Hosea 1" },
      { day: 296, reading: "Hosea 2" },
      { day: 297, reading: "Hosea 3" },
      { day: 298, reading: "Hosea 4" },
      { day: 299, reading: "Hosea 5" },
      { day: 300, reading: "Hosea 6" },
      { day: 301, reading: "Hosea 7" },
      { day: 302, reading: "Hosea 8" },
      { day: 303, reading: "Hosea 9" },
      { day: 304, reading: "Hosea 10" },
      { day: 305, reading: "Hosea 11" },
      { day: 306, reading: "Hosea 12" },
      { day: 307, reading: "Hosea 13" },
      { day: 308, reading: "Hosea 14" },
      { day: 309, reading: "Joel 1" },
      { day: 310, reading: "Joel 2" },
      { day: 311, reading: "Joel 3" },
      { day: 312, reading: "Amos 1" },
      { day: 313, reading: "Amos 2" },
      { day: 314, reading: "Amos 3" },
      { day: 315, reading: "Amos 4" },
      { day: 316, reading: "Amos 5" },
      { day: 317, reading: "Amos 6" },
      { day: 318, reading: "Amos 7" },
      { day: 319, reading: "Amos 8" },
      { day: 320, reading: "Amos 9" },
      { day: 321, reading: "Obadiah 1" },
      { day: 322, reading: "Jonah 1" },
      { day: 323, reading: "Jonah 2" },
      { day: 324, reading: "Jonah 3" },
      { day: 325, reading: "Jonah 4" },
      { day: 326, reading: "Micah 1" },
      { day: 327, reading: "Micah 2" },
      { day: 328, reading: "Micah 3" },
      { day: 329, reading: "Micah 4" },
      { day: 330, reading: "Micah 5" },
      { day: 331, reading: "Micah 6" },
      { day: 332, reading: "Micah 7" },
      { day: 333, reading: "Nahum 1" },
      { day: 334, reading: "Nahum 2" },
      { day: 335, reading: "Nahum 3" },
      { day: 336, reading: "Habakkuk 1" },
      { day: 337, reading: "Habakkuk 2" },
      { day: 338, reading: "Habakkuk 3" },
      { day: 339, reading: "Zephaniah 1" },
      { day: 340, reading: "Zephaniah 2" },
      { day: 341, reading: "Zephaniah 3" },
      { day: 342, reading: "Haggai 1" },
      { day: 343, reading: "Haggai 2" },
      { day: 344, reading: "Zechariah 1" },
      { day: 345, reading: "Zechariah 2" },
      { day: 346, reading: "Zechariah 3" },
      { day: 347, reading: "Zechariah 4" },
      { day: 348, reading: "Zechariah 5" },
      { day: 349, reading: "Zechariah 6" },
      { day: 350, reading: "Zechariah 7" },
      { day: 351, reading: "Zechariah 8" },
      { day: 352, reading: "Zechariah 9" },
      { day: 353, reading: "Zechariah 10" },
      { day: 354, reading: "Zechariah 11" },
      { day: 355, reading: "Zechariah 12" },
      { day: 356, reading: "Zechariah 13" },
      { day: 357, reading: "Zechariah 14" },
      { day: 358, reading: "Malachi 1" },
      { day: 359, reading: "Malachi 2" },
      { day: 360, reading: "Malachi 3" },
      { day: 361, reading: "Malachi 4" }
    ];

    // Check if this is Yom Kippur - use Jonah
    const events = HebrewCalendar.calendar({
      start: date,
      end: date,
      location: Location.lookup('Jerusalem'),
      sedrot: true
    });

    const yomKippurEvent = events.find(event => {
      const desc = event.getDesc();
      return desc && desc.includes('Yom Kippur');
    });

    if (yomKippurEvent) {
      return 'Jonah';
    }

    // Find the next Simchat Torah to calculate days since last cycle start
    const currentYear = date.getFullYear();
    console.log('Prophets calculation - current year:', currentYear);

    // Get Simchat Torah dates for current year and previous year
    const currentYearDates = this.getSimchatTorahDates(currentYear);
    const previousYearDates = this.getSimchatTorahDates(currentYear - 1);
    const simchatTorahDates = [...previousYearDates, ...currentYearDates];

    if (simchatTorahDates.length === 0) {
      console.log('Prophets calculation - no Simchat Torah dates found');
      return null;
    } else {
      console.log('Prophets calculation - found Simchat Torah dates:', simchatTorahDates);
    }

    // Find the most recent Simchat Torah before this date
    let lastSimchatTorah = null;
    for (const simchatDate of simchatTorahDates) {
      if (simchatDate <= date) {
        lastSimchatTorah = simchatDate;
      } else {
        break;
      }
    }

    if (!lastSimchatTorah) {
      console.log('Prophets calculation - no Simchat Torah found before date');
      return null; // Prophets haven't started yet
    }

    console.log('Prophets calculation - last Simchat Torah:', lastSimchatTorah.toISOString().split('T')[0]);

    // Calculate days since last Simchat Torah
    const daysSinceSimchatTorah = Math.floor((date.getTime() - lastSimchatTorah.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceSimchatTorah <= 0) {
      console.log('Prophets calculation - still on Simchat Torah');
      return null; // Still on Simchat Torah
    }

    // Find the current reading
    const dayIndex = daysSinceSimchatTorah - 1; // 0-indexed
    console.log('Prophets calculation - days since Simchat Torah:', daysSinceSimchatTorah);
    console.log('Prophets calculation - day index:', dayIndex);
    console.log('Prophets calculation - schedule length:', NEVIIM_SCHEDULE.length);

    if (dayIndex < NEVIIM_SCHEDULE.length) {
      const reading = NEVIIM_SCHEDULE[dayIndex].reading;
      console.log('Prophets calculation - found reading:', reading);
      return reading;
    } else {
      // We've finished the schedule, pause until next Simchat Torah
      console.log('Prophets calculation - day index out of range');
      return null;
    }
  }

  /**
   * Generate extended Brit Chadashah schedule to fill the Hebrew year
   * Starting with Matthew, then going through Revelation multiple times
   */
  private generateExtendedBritChadashahSchedule(): Array<{ day: number; reading: string }> {
    const schedule: Array<{ day: number; reading: string }> = [];
    let dayCounter = 1;

    // New Testament books with their chapter counts
    const ntBooks = [
      { name: 'Matthew', chapters: 28 },
      { name: 'Mark', chapters: 16 },
      { name: 'Luke', chapters: 24 },
      { name: 'John', chapters: 21 },
      { name: 'Acts', chapters: 28 },
      { name: 'Romans', chapters: 16 },
      { name: '1 Corinthians', chapters: 16 },
      { name: '2 Corinthians', chapters: 13 },
      { name: 'Galatians', chapters: 6 },
      { name: 'Ephesians', chapters: 6 },
      { name: 'Philippians', chapters: 4 },
      { name: 'Colossians', chapters: 4 },
      { name: '1 Thessalonians', chapters: 5 },
      { name: '2 Thessalonians', chapters: 3 },
      { name: '1 Timothy', chapters: 6 },
      { name: '2 Timothy', chapters: 4 },
      { name: 'Titus', chapters: 3 },
      { name: 'Philemon', chapters: 1 },
      { name: 'Hebrews', chapters: 13 },
      { name: 'James', chapters: 5 },
      { name: '1 Peter', chapters: 5 },
      { name: '2 Peter', chapters: 3 },
      { name: '1 John', chapters: 5 },
      { name: '2 John', chapters: 1 },
      { name: '3 John', chapters: 1 },
      { name: 'Jude', chapters: 1 },
      { name: 'Revelation', chapters: 22 }
    ];

    // Generate schedule to fill approximately 350-360 days (Hebrew year minus Sabbaths/holidays)
    const targetDays = 360;

    while (schedule.length < targetDays) {
      for (const book of ntBooks) {
        for (let chapter = 1; chapter <= book.chapters; chapter++) {
          schedule.push({
            day: dayCounter,
            reading: `${book.name} ${chapter}`
          });
          dayCounter++;

          if (schedule.length >= targetDays) {
            break;
          }
        }
        if (schedule.length >= targetDays) {
          break;
        }
      }
    }

    return schedule;
  }

  /**
   * Get Simchat Torah dates for a year
   */
  private getSimchatTorahDates(year: number): Date[] {
    console.log('Getting Simchat Torah dates for year:', year);
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const events = HebrewCalendar.calendar({
      start: startDate,
      end: endDate,
      location: Location.lookup('Jerusalem'),
      sedrot: true
    });

    console.log('Total events found:', events.length);

    const simchatTorahEvents = events.filter(event => {
      const desc = event.getDesc();
      return desc && (desc.includes('Simchat Torah') || desc.includes('Shemini Atzeret') || desc.includes('Shmini Atzeret'));
    });

    console.log('Simchat Torah events found:', simchatTorahEvents.length);
    simchatTorahEvents.forEach(event => {
      console.log('Simchat Torah event:', event.getDesc(), 'on', event.getDate().greg().toISOString().split('T')[0]);
    });

    return simchatTorahEvents.map(event => event.getDate().greg());
  }

  /**
   * Get Brit Chadashah reading for a date
   * Uses Tanakh Yomi style schedule starting with John, then following Biblical order
   */
  private getBritChadashahReading(date: Date): string | null {
    try {
      console.log('Brit Chadashah calculation - starting for date:', date.toISOString().split('T')[0]);

      // Check if this is a Sabbath or holiday - skip readings
      const hdate = new HDate(date);
      const events = HebrewCalendar.calendar({
        start: date,
        end: date,
        location: Location.lookup('Jerusalem'),
        sedrot: true
      });

      // Check for Sabbath
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 6) {
        console.log('Brit Chadashah calculation - Sabbath, skipping');
        return null;
      }

      // Check for holidays
      const holidayEvent = events.find(event => {
        const desc = event.getDesc();
        return desc && (
          desc.includes('Rosh Hashana') ||
          desc.includes('Yom Kippur') ||
          desc.includes('Sukkot') ||
          desc.includes('Shemini Atzeret') ||
          desc.includes('Simchat Torah') ||
          desc.includes('Pesach') ||
          desc.includes('Shavuot') ||
          desc.includes('Purim') ||
          desc.includes('Chanukah') ||
          desc.includes('Tisha B\'Av') ||
          desc.includes('Tu B\'Shvat') ||
          desc.includes('Lag B\'Omer') ||
          desc.includes('Yom HaAtzmaut') ||
          desc.includes('Yom HaZikaron') ||
          desc.includes('Yom Yerushalayim')
        );
      });

      if (holidayEvent) {
        console.log('Brit Chadashah calculation - holiday found:', holidayEvent.getDesc());
        return null;
      }

      // Extended Brit Chadashah schedule to fill the Hebrew year
      // Starting with Matthew, then going through Revelation multiple times
      const BRIT_CHADASHAH_SCHEDULE = this.generateExtendedBritChadashahSchedule();

      // Find the next Simchat Torah to calculate days since last cycle start
      const currentYear = date.getFullYear();
      console.log('Brit Chadashah calculation - current year:', currentYear);

      // Get Simchat Torah dates for current year and previous year
      const currentYearDates = this.getSimchatTorahDates(currentYear);
      const previousYearDates = this.getSimchatTorahDates(currentYear - 1);
      const simchatTorahDates = [...previousYearDates, ...currentYearDates];

      if (simchatTorahDates.length === 0) {
        console.log('Brit Chadashah calculation - no Simchat Torah dates found');
        return null;
      } else {
        console.log('Brit Chadashah calculation - found Simchat Torah dates:', simchatTorahDates);
      }

      // Find the most recent Simchat Torah before this date
      let lastSimchatTorah = null;
      for (const simchatDate of simchatTorahDates) {
        if (simchatDate <= date) {
          lastSimchatTorah = simchatDate;
        } else {
          break;
        }
      }

      if (!lastSimchatTorah) {
        console.log('Brit Chadashah calculation - no Simchat Torah found before date');
        return null; // Brit Chadashah haven't started yet
      }

      console.log('Brit Chadashah calculation - last Simchat Torah:', lastSimchatTorah.toISOString().split('T')[0]);

      // Calculate days since last Simchat Torah
      const daysSinceSimchatTorah = Math.floor((date.getTime() - lastSimchatTorah.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSinceSimchatTorah <= 0) {
        console.log('Brit Chadashah calculation - still on Simchat Torah');
        return null; // Still on Simchat Torah
      }

      // Find the current reading
      const dayIndex = daysSinceSimchatTorah - 1; // 0-indexed
      console.log('Brit Chadashah calculation - days since Simchat Torah:', daysSinceSimchatTorah);
      console.log('Brit Chadashah calculation - day index:', dayIndex);
      console.log('Brit Chadashah calculation - schedule length:', BRIT_CHADASHAH_SCHEDULE.length);

      if (dayIndex < BRIT_CHADASHAH_SCHEDULE.length) {
        const reading = BRIT_CHADASHAH_SCHEDULE[dayIndex].reading;
        console.log('Brit Chadashah calculation - found reading:', reading);
        return reading;
      } else {
        // We've finished the schedule, pause until next Simchat Torah
        console.log('Brit Chadashah calculation - day index out of range');
        return null;
      }
    } catch (error) {
      console.error('Error getting Brit Chadashah reading:', error);
      return null;
    }
  }

  /**
   * Get readings for a date range
   */
  getReadingsForDateRange(startDate: Date, endDate: Date): DailyReadings[] {
    const readings: DailyReadings[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      readings.push(this.getDailyReadings(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return readings;
  }

  /**
   * Get detailed Torah reading information for a parashah
   */
  getDetailedTorahReading(parashah: string): any {
    try {
      return leyning.getLeyningForParsha(parashah);
    } catch (error) {
      console.error('Error getting detailed Torah reading:', error);
      return null;
    }
  }

  /**
   * Get all aliyot for a parashah
   */
  getAliyotForParashah(parashah: string): TorahReading[] {
    try {
      const leyningData = leyning.getLeyningForParsha(parashah);
      if (leyningData && leyningData.fullkriyah) {
        return Object.keys(leyningData.fullkriyah)
          .filter(key => !isNaN(Number(key))) // Only numeric keys (aliyot, not Maftir)
          .map(key => {
            const aliyah = leyningData.fullkriyah[key];
            return {
              book: aliyah.k,
              start: aliyah.b,
              end: aliyah.e,
              verses: aliyah.v || 0
            };
          });
      }
      return [];
    } catch (error) {
      console.error('Error getting aliyot for parashah:', error);
      return [];
    }
  }
}
