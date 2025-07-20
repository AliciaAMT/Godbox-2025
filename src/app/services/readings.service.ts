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

      // Get Writings and Prophets from Tanakh Yomi (we'll implement this next)
      const tanakhReadings = this.getTanakhReadings(hdate);
      if (tanakhReadings) {
        readings.writings = tanakhReadings.writings;
        readings.prophets = tanakhReadings.prophets;
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
   * This would need to be implemented with a Tanakh Yomi API or mapping
   */
  private getTanakhReadings(hdate: HDate): { writings?: string; prophets?: string } | null {
    // TODO: Implement Tanakh Yomi API integration
    // For now, return null - we'll implement this next
    return null;
  }

  /**
   * Get Brit Chadashah reading for a date
   * This would need to be implemented with a mapping service
   */
  private getBritChadashahReading(date: Date): string | null {
    // TODO: Implement Brit Chadashah mapping
    // For now, return null - we'll implement this next
    return null;
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
