import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DataService, Readings } from './data.service';
import { SabbathReadingsService, SabbathReading } from './sabbath-readings.service';
import { HebrewCalendar, Location, HDate } from '@hebcal/core';

export interface EnhancedReading extends Readings {
  isSabbath?: boolean;
  completeTorahReading?: string;
  haftarahReference?: string;
  weekReadings?: any[];
  sabbathReading?: SabbathReading;
}

@Injectable({
  providedIn: 'root'
})
export class EnhancedDailyReadingsService {

  constructor(
    private dataService: DataService,
    private sabbathReadingsService: SabbathReadingsService
  ) { }

  /**
   * Get enhanced daily readings that include full Torah readings and haftarah on Sabbath
   */
  getEnhancedDailyReadings(): Observable<EnhancedReading[]> {
    return this.dataService.getReadingByThisDate().pipe(
      switchMap(readings => {
        if (readings.length === 0) {
          return of([]);
        }

        // Check if today is Sabbath
        const today = new Date();
        console.log('🔍 Current date:', today);
        console.log('🔍 Is Sabbath?', this.isSabbath(today));

        // Convert to Hebrew date
        const hDate = new HDate(today);
        console.log('🔍 Hebrew date:', hDate.toString());
        console.log('🔍 Hebrew date gregorian:', hDate.greg().toISOString().split('T')[0]);

        const isSabbath = this.isSabbath(today);

        if (isSabbath) {
          // For Sabbath, get the week's readings from the database
          return this.getSabbathReadingsFromDatabase(today);
        }

        // Return regular readings for non-Sabbath days
        return of(this.enhanceRegularReadings(readings));
      })
    );
  }

  /**
   * Get enhanced readings for a specific date
   */
  getEnhancedReadingsForDate(date: Date): Observable<EnhancedReading[]> {
    const formattedDate = this.formatDate(date);
    console.log('🔍 Getting enhanced readings for date:', formattedDate);

    return this.dataService.getReadings().pipe(
      map(readings => readings.filter(r => r.date === formattedDate)),
      switchMap(readings => {
        if (readings.length === 0) {
          console.log('⚠️ No readings found for date:', formattedDate);
          return of([]);
        }

        // Check if any of the readings is a Sabbath reading (kriyah: 7)
        const sabbathReading = readings.find(r => r.kriyah === 7);

        if (sabbathReading) {
          console.log('✅ Found Sabbath reading with kriyah: 7, using database logic');
          // Use the database Sabbath readings logic
          return this.getSabbathReadingsFromDatabase(date);
        }

        const isSabbath = this.isSabbath(date);

        if (isSabbath) {
          console.log('✅ Date is Sabbath, using Sabbath readings service');
          // Get Sabbath readings for the specific date
          const sabbathReadings = this.sabbathReadingsService.getSabbathReadingsForDate(date);

          if (sabbathReadings.length > 0) {
            return of(this.createSabbathReadings(sabbathReadings));
          }
        }

        console.log('📖 Using regular readings for non-Sabbath day');
        // Return regular readings for non-Sabbath days
        return of(this.enhanceRegularReadings(readings));
      })
    );
  }

  /**
   * Create enhanced Sabbath readings
   */
  private createSabbathReadings(sabbathReadings: SabbathReading[]): EnhancedReading[] {
    const enhancedReadings: EnhancedReading[] = [];

    for (const sabbathReading of sabbathReadings) {
      // Create a comprehensive Sabbath reading
      const enhancedReading: EnhancedReading = {
        id: sabbathReading.idNo.toString(),
        idNo: sabbathReading.idNo,
        parashat: sabbathReading.parashat,
        parashatHeb: sabbathReading.parashatHeb,
        parashatEng: sabbathReading.parashatEng,
        date: sabbathReading.sabbathDate,
        holiday: `Parashat ${sabbathReading.parashat}`,
        holidayReadings: '',
        holidayDate: sabbathReading.hebrewDate,
        kriyah: 7, // Sabbath is the 7th day
        kriyahHeb: 'קריאה ז',
        kriyahEng: 'Reading 7',
        kriyahDate: sabbathReading.hebrewDate,
        torah: sabbathReading.completeTorahReading,
        prophets: sabbathReading.haftarah,
        writings: '',
        britChadashah: '',
        haftarah: sabbathReading.haftarah,
        isSabbath: true,
        completeTorahReading: sabbathReading.completeTorahReading,
        haftarahReference: sabbathReading.haftarahReference,
        weekReadings: sabbathReading.weekReadings,
        sabbathReading: sabbathReading
      };

      enhancedReadings.push(enhancedReading);
    }

    return enhancedReadings;
  }

  /**
   * Enhance regular readings for non-Sabbath days
   */
  private enhanceRegularReadings(readings: Readings[]): EnhancedReading[] {
    return readings.map(reading => ({
      ...reading,
      isSabbath: false
    }));
  }

  /**
   * Check if a date is Sabbath
   */
  private isSabbath(date: Date): boolean {
    const hDate = new HDate(date);
    return hDate.getDay() === 6; // 6 = Saturday
  }

  /**
   * Format date as YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Update Firebase database with enhanced readings
   */
  async updateFirebaseWithEnhancedReadings(): Promise<void> {
    console.log('🔄 Starting Firebase database update with enhanced readings...');

    try {
      // Clear existing readings
      await this.dataService.clearReadingsCollection();
      console.log('✅ Cleared existing readings collection');

      // Generate enhanced readings for the current year
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear}-01-01`);
      const endDate = new Date(`${currentYear + 1}-01-01`);

      // Get all Sabbath readings for the year
      const sabbathReadings = this.sabbathReadingsService.getSabbathReadings(startDate, endDate);

      // Convert Sabbath readings to Firebase format
      const firebaseReadings: Readings[] = [];
      let idNo = 1;

      for (const sabbathReading of sabbathReadings) {
        // Add the comprehensive Sabbath reading
        const sabbathFirebaseReading: Readings = {
          idNo: idNo++,
          parashat: sabbathReading.parashat,
          parashatHeb: sabbathReading.parashatHeb,
          parashatEng: sabbathReading.parashatEng,
          date: sabbathReading.sabbathDate,
          holiday: `Parashat ${sabbathReading.parashat}`,
          holidayReadings: '',
          holidayDate: sabbathReading.hebrewDate,
          kriyah: 7,
          kriyahHeb: 'קריאה ז',
          kriyahEng: 'Reading 7',
          kriyahDate: sabbathReading.hebrewDate,
          torah: sabbathReading.completeTorahReading,
          prophets: sabbathReading.haftarah,
          writings: '',
          britChadashah: '',
          haftarah: sabbathReading.haftarah
        };

        firebaseReadings.push(sabbathFirebaseReading);

        // Add individual daily readings for the week
        for (const dailyReading of sabbathReading.weekReadings) {
          const dailyFirebaseReading: Readings = {
            idNo: idNo++,
            parashat: sabbathReading.parashat,
            parashatHeb: sabbathReading.parashatHeb,
            parashatEng: sabbathReading.parashatEng,
            date: dailyReading.date,
            holiday: `Parashat ${sabbathReading.parashat}`,
            holidayReadings: '',
            holidayDate: this.getHebrewDate(new Date(dailyReading.date)),
            kriyah: dailyReading.day,
            kriyahHeb: `קריאה ${this.getHebrewNumber(dailyReading.day)}`,
            kriyahEng: `Reading ${dailyReading.day}`,
            kriyahDate: this.getHebrewDate(new Date(dailyReading.date)),
            torah: dailyReading.torahReading,
            prophets: '',
            writings: '',
            britChadashah: '',
            haftarah: ''
          };

          firebaseReadings.push(dailyFirebaseReading);
        }
      }

      // Add readings to Firebase
      await this.dataService.addReadings(firebaseReadings);
      console.log(`✅ Successfully added ${firebaseReadings.length} enhanced readings to Firebase`);

    } catch (error) {
      console.error('❌ Error updating Firebase database:', error);
      throw error;
    }
  }

  /**
   * Get Hebrew number
   */
  private getHebrewNumber(num: number): string {
    const hebrewNumbers = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'];
    return hebrewNumbers[num - 1] || num.toString();
  }

  /**
   * Get Hebrew date
   */
  private getHebrewDate(date: Date): string {
    const hDate = new HDate(date);
    return hDate.toString();
  }

  /**
   * Get Sabbath readings from database instead of generating new ones
   */
  private getSabbathReadingsFromDatabase(sabbathDate: Date): Observable<EnhancedReading[]> {
    const sabbathDateStr = this.formatDate(sabbathDate);
    console.log('🔍 Getting Sabbath readings from database for:', sabbathDateStr);

    // Convert to Hebrew date for comparison
    const hDate = new HDate(sabbathDate);
    const hebrewDateStr = hDate.toString();
    console.log('🔍 Hebrew date for comparison:', hebrewDateStr);

    return this.dataService.getReadings().pipe(
      map(allReadings => {
        console.log('🔍 Total readings in database:', allReadings.length);

        // Log a few sample readings to see the date format
        const sampleReadings = allReadings.slice(0, 5);
        console.log('🔍 Sample readings:', sampleReadings.map(r => ({ date: r.date, parashat: r.parashat, kriyah: r.kriyah })));

        // First, try to find a Sabbath reading for this date with kriyah: 7
        let sabbathReading = allReadings.find(r => r.date === sabbathDateStr && r.kriyah === 7);

        if (!sabbathReading) {
          console.log('⚠️ No Sabbath reading with kriyah: 7 found, looking for any reading on this date...');

          // If no Sabbath reading with kriyah: 7, look for any reading on this date
          const readingsForDate = allReadings.filter(r => r.date === sabbathDateStr);
          console.log('🔍 Readings found for date:', readingsForDate.length);

          if (readingsForDate.length > 0) {
            // Use the first reading for this date and treat it as Sabbath
            sabbathReading = readingsForDate[0];
            console.log('✅ Using first reading for date as Sabbath:', sabbathReading.parashat);
          } else {
            console.log('⚠️ No readings found for date:', sabbathDateStr);

            // Try to find readings with Hebrew date format
            const readingsWithHebrewDate = allReadings.filter(r => {
              try {
                if (!r.date) return false;
                const readingDate = new Date(r.date);
                const readingHDate = new HDate(readingDate);
                return readingHDate.toString() === hebrewDateStr;
              } catch (e) {
                return false;
              }
            });

            console.log('🔍 Readings found with Hebrew date:', readingsWithHebrewDate.length);

            if (readingsWithHebrewDate.length > 0) {
              sabbathReading = readingsWithHebrewDate[0];
              console.log('✅ Using reading with Hebrew date as Sabbath:', sabbathReading.parashat);
            } else {
              console.log('⚠️ No readings found with Hebrew date either');
              return [];
            }
          }
        } else {
          console.log('✅ Found Sabbath reading with kriyah: 7:', sabbathReading.parashat);
        }

        // Get all readings for this parashah from the database
        const parashahReadings = allReadings.filter(r => r.parashat === sabbathReading.parashat);
        console.log('🔍 Total readings for parashah', sabbathReading.parashat + ':', parashahReadings.length);

        // Create weekReadings from the database
        const weekReadings = parashahReadings
          .filter(r => r.kriyah >= 1 && r.kriyah <= 7)
          .sort((a, b) => a.kriyah - b.kriyah)
          .map(reading => ({
            day: reading.kriyah,
            dayName: this.getDayName(reading.kriyah),
            date: reading.date,
            torahReading: reading.torah || '',
            torahReference: reading.torah || ''
          }));

        console.log('🔍 Week readings created:', weekReadings.length);

        // Combine all Torah readings for the complete Sabbath reading
        const completeTorahReading = weekReadings
          .map(reading => reading.torahReading)
          .filter(reading => reading && reading.trim() !== '')
          .join('; ');

        // Create enhanced Sabbath reading
        const enhancedReading: EnhancedReading = {
          ...sabbathReading,
          isSabbath: true, // Always set to true for Sabbath readings from database
          completeTorahReading,
          weekReadings,
          haftarah: sabbathReading.haftarah || sabbathReading.prophets || '',
          haftarahReference: sabbathReading.haftarah || sabbathReading.prophets || ''
        };

        console.log('🔍 Enhanced Sabbath reading haftarah debug:', {
          originalHaftarah: sabbathReading.haftarah,
          originalProphets: sabbathReading.prophets,
          finalHaftarah: enhancedReading.haftarah,
          finalHaftarahReference: enhancedReading.haftarahReference
        });

        return [enhancedReading];
      })
    );
  }

  /**
   * Get day name from kriyah number
   */
  private getDayName(kriyah: number): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[kriyah - 1] || `Day ${kriyah}`;
  }
}
