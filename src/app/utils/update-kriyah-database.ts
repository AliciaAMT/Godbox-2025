import { HaftarahService } from '../services/haftarah.service';
import { ParashahService } from '../services/parashah.service';
import { ScriptureMappingService } from '../services/scripture-mapping.service';
import { HebrewCalendar, Location, Event, HDate } from '@hebcal/core';

/**
 * Utility to update the kriyah.ts database file with new haftarah readings
 * and complete Sabbath readings
 */
export class KriyahDatabaseUpdater {

  constructor(
    private haftarahService: HaftarahService,
    private parashahService: ParashahService,
    private scriptureMappingService: ScriptureMappingService
  ) {}

  /**
   * Generate updated kriyah data with haftarah readings
   */
  generateUpdatedKriyahData(startDate: Date, endDate: Date): any {
    const updatedKriyah: any = {};
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
          const kriyah = day + 1;
          const scriptureReadings = this.scriptureMappingService.getScriptureReferences(parashat, kriyah);

          // Get haftarah for Shabbat (kriyah 7)
          const haftarahRef = kriyah === 7 ? this.haftarahService.getHaftarahReference(parashat) : '';

          const reading = {
            idNo: idNo++,
            parashat,
            parashatHeb: this.getParashahHebrew(parashat),
            parashatEng: this.getParashahEnglish(parashat),
            date: this.formatDate(readingDate),
            holiday: `Parashat ${parashat}`,
            holidayReadings: "",
            holidayDate: this.getHebrewDate(readingDate),
            kriyah,
            kriyahHeb: this.getKriyahHebrew(kriyah),
            kriyahEng: `Reading ${kriyah}`,
            kriyahDate: this.getHebrewDate(readingDate),
            torah: scriptureReadings?.torah?.reference || '',
            prophets: scriptureReadings?.prophets?.reference || '',
            writings: scriptureReadings?.writings?.reference || '',
            britChadashah: scriptureReadings?.britChadashah?.reference || '',
            haftarah: haftarahRef,
            apostles: scriptureReadings?.britChadashah?.reference || ''
          };

          updatedKriyah[idNo - 1] = reading;
        }
      }
    }

    return updatedKriyah;
  }

  /**
   * Generate TypeScript code for the updated kriyah data
   */
  generateKriyahTypeScriptCode(kriyahData: any): string {
    let code = 'export const KRIYAH: any = {\n';

    // Sort by idNo to maintain order
    const sortedEntries = Object.entries(kriyahData).sort((a, b) => {
      return (a[1] as any).idNo - (b[1] as any).idNo;
    });

    for (const [key, reading] of sortedEntries) {
      const r = reading as any;
      code += `  ${r.idNo}: {\n`;
      code += `    idNo: ${r.idNo},\n`;
      code += `    parashat: "${this.escapeForDoubleQuotes(r.parashat)}",\n`;
      code += `    parashatHeb: "${this.escapeForDoubleQuotes(r.parashatHeb)}",\n`;
      code += `    parashatEng: "${this.escapeForDoubleQuotes(r.parashatEng)}",\n`;
      code += `    date: "${r.date}",\n`;
      code += `    holiday: "${this.escapeForDoubleQuotes(r.holiday)}",\n`;
      code += `    holidayReadings: "${this.escapeForDoubleQuotes(r.holidayReadings)}",\n`;
      code += `    holidayDate: "${this.escapeForDoubleQuotes(r.holidayDate)}",\n`;
      code += `    kriyah: ${r.kriyah},\n`;
      code += `    kriyahHeb: "${this.escapeForDoubleQuotes(r.kriyahHeb)}",\n`;
      code += `    kriyahEng: "${this.escapeForDoubleQuotes(r.kriyahEng)}",\n`;
      code += `    kriyahDate: "${this.escapeForDoubleQuotes(r.kriyahDate)}",\n`;
      code += `    torah: "${this.escapeForDoubleQuotes(r.torah)}",\n`;
      code += `    prophets: "${this.escapeForDoubleQuotes(r.prophets)}",\n`;
      code += `    writings: "${this.escapeForDoubleQuotes(r.writings)}",\n`;
      code += `    britChadashah: "${this.escapeForDoubleQuotes(r.britChadashah)}",\n`;
      code += `    haftarah: "${this.escapeForDoubleQuotes(r.haftarah)}",\n`;
      code += `    apostles: "${this.escapeForDoubleQuotes(r.apostles)}"\n`;
      code += `  },\n`;
    }

    code += '};\n';
    return code;
  }

  /**
   * Update the kriyah.ts file with new data
   */
  async updateKriyahFile(startDate: Date, endDate: Date): Promise<string> {
    const kriyahData = this.generateUpdatedKriyahData(startDate, endDate);
    const typescriptCode = this.generateKriyahTypeScriptCode(kriyahData);

    // Write to file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '../database/kriyah.ts');

    try {
      fs.writeFileSync(filePath, typescriptCode, 'utf8');
      console.log(`✅ Updated kriyah.ts with ${Object.keys(kriyahData).length} readings`);
      return typescriptCode;
    } catch (error) {
      console.error('❌ Error updating kriyah.ts:', error);
      throw error;
    }
  }

  /**
   * Generate Sabbath-specific data for the database
   */
  generateSabbathDatabaseData(startDate: Date, endDate: Date): any {
    const sabbathData: any = {};
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

    // Generate Sabbath readings for each parashah
    for (const parashahEvent of parashotEvents) {
      const parashat = parashahEvent.basename();
      const parashahStartDate = parashahEvent.getDate().greg();

      // Calculate the Sabbath date (7th day of the week)
      const sabbathDate = new Date(parashahStartDate);
      sabbathDate.setDate(sabbathDate.getDate() + 6); // 7th day (0-indexed, so +6)

      // Only include if Sabbath falls within our date range
      if (sabbathDate >= startDate && sabbathDate <= endDate) {
        // Generate complete week's readings
        const weekReadings = this.generateWeekReadings(parashat, parashahStartDate);
        const haftarahRef = this.haftarahService.getHaftarahReference(parashat);
        const completeTorahReading = this.combineTorahReadings(weekReadings);

        const sabbathReading = {
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

        sabbathData[idNo - 1] = sabbathReading;
      }
    }

    return sabbathData;
  }

  /**
   * Generate daily readings for the week
   */
  private generateWeekReadings(parashah: string, startDate: Date): any[] {
    const weekReadings: any[] = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let day = 0; day < 7; day++) {
      const readingDate = new Date(startDate);
      readingDate.setDate(readingDate.getDate() + day);

      const kriyah = day + 1;
      const scriptureReadings = this.scriptureMappingService.getScriptureReferences(parashah, kriyah);

      const dailyReading = {
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
  private combineTorahReadings(weekReadings: any[]): string {
    const torahReadings = weekReadings
      .map(reading => reading.torahReading)
      .filter(reading => reading && reading.trim() !== '')
      .join('; ');

    return torahReadings;
  }

  // Helper methods (copied from ParashahService)
  private getParashahHebrew(parashah: string): string {
    const translations = this.parashahService['parashahTranslations'];
    return translations[parashah]?.heb || parashah;
  }

  private getParashahEnglish(parashah: string): string {
    const translations = this.parashahService['parashahTranslations'];
    return translations[parashah]?.eng || parashah;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getHebrewDate(date: Date): string {
    const hDate = new HDate(date);
    return hDate.toString();
  }

  private getKriyahHebrew(kriyah: number): string {
    const hebrewNumbers = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז'];
    return `קריאה ${hebrewNumbers[kriyah - 1] || kriyah}`;
  }

  private escapeForDoubleQuotes(str: string): string {
    return str.replace(/"/g, '\\"');
  }
}

/**
 * Standalone function to update the kriyah database
 */
export async function updateKriyahDatabase() {
  console.log('🔄 Starting kriyah database update...');

  const haftarahService = new HaftarahService();
  const scriptureMappingService = new ScriptureMappingService();
  const parashahService = new ParashahService(scriptureMappingService, haftarahService);

  const updater = new KriyahDatabaseUpdater(haftarahService, parashahService, scriptureMappingService);

  // Generate data for the next year
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);

  try {
    const updatedCode = await updater.updateKriyahFile(startDate, endDate);
    console.log('✅ Database update completed successfully!');
    console.log(`📊 Generated ${Object.keys(updater.generateUpdatedKriyahData(startDate, endDate)).length} readings`);
    return updatedCode;
  } catch (error) {
    console.error('❌ Database update failed:', error);
    throw error;
  }
}
