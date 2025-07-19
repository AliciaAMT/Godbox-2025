import { Injectable } from '@angular/core';
import { DataService, Readings } from './data.service';
import { SabbathReadingsService } from './sabbath-readings.service';
import { HDate } from '@hebcal/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUpdaterService {

  constructor(
    private dataService: DataService,
    private sabbathReadingsService: SabbathReadingsService
  ) { }

  /**
   * Update Firebase database with enhanced readings including haftarah and complete Torah readings
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

      return Promise.resolve();

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
   * Get status of Firebase database
   */
  async getFirebaseStatus(): Promise<{ totalReadings: number; lastUpdated: string }> {
    try {
      const readings = await this.dataService.getReadings().toPromise();
      return {
        totalReadings: readings?.length || 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting Firebase status:', error);
      throw error;
    }
  }
}
