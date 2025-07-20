import { HebrewCalendar, Location, Event } from '@hebcal/core';
import * as fs from 'fs';
import * as path from 'path';

interface WritingsBook {
  name: string;
  chapters: number;
}

const WRITINGS_BOOKS: WritingsBook[] = [
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Songs", chapters: 8 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Job", chapters: 42 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Daniel", chapters: 12 }
];

interface KriyahEntry {
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

interface KriyahData {
  [key: string]: KriyahEntry;
}

function findSimchatTorahDates(year: number): { start: Date; end: Date } {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const events = HebrewCalendar.calendar({
    start: startDate,
    end: endDate,
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });

  const simchatTorahEvents = events.filter(event => {
    const desc = event.getDesc();
    return desc && desc.includes('Simchat Torah');
  });

  if (simchatTorahEvents.length === 0) {
    throw new Error(`No Simchat Torah events found for ${year}`);
  }

  // Sort by date and get the first occurrence (start of year)
  simchatTorahEvents.sort((a, b) => a.getDate().greg().getTime() - b.getDate().greg().getTime());

  const startSimchatTorah = simchatTorahEvents[0].getDate().greg();

  // Find the next Simchat Torah (end of year)
  const nextYearEvents = HebrewCalendar.calendar({
    start: new Date(`${year + 1}-01-01`),
    end: new Date(`${year + 1}-12-31`),
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });

  const nextSimchatTorahEvents = nextYearEvents.filter(event => {
    const desc = event.getDesc();
    return desc && desc.includes('Simchat Torah');
  });

  const endSimchatTorah = nextSimchatTorahEvents[0].getDate().greg();

  return { start: startSimchatTorah, end: endSimchatTorah };
}

function getHolidayEvents(startDate: Date, endDate: Date): Event[] {
  return HebrewCalendar.calendar({
    start: startDate,
    end: endDate,
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });
}

function isHolidayWithSpecialReadings(date: Date, holidayEvents: Event[]): boolean {
  const dayEvents = holidayEvents.filter(event => {
    const eventDate = event.getDate().greg();
    return eventDate.getDate() === date.getDate() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getFullYear() === date.getFullYear();
  });

  return dayEvents.some(event => {
    const desc = event.getDesc();
    return desc && (
      desc.includes('Rosh Hashanah') ||
      desc.includes('Yom Kippur') ||
      desc.includes('Sukkot') ||
      desc.includes('Pesach') ||
      desc.includes('Shavuot') ||
      desc.includes('Purim') ||
      desc.includes('Chanukah')
    );
  });
}

function generateWritingsReadings(startDate: Date, endDate: Date): Map<string, string> {
  const readings = new Map<string, string>();
  let currentBookIndex = 0;
  let currentChapter = 1;

  const holidayEvents = getHolidayEvents(startDate, endDate);

  const currentDate = new Date(startDate);

  while (currentDate <= endDate && currentBookIndex < WRITINGS_BOOKS.length) {
    const dateString = currentDate.toISOString().split('T')[0];

    // Skip holidays with special readings
    if (!isHolidayWithSpecialReadings(currentDate, holidayEvents)) {
      const book = WRITINGS_BOOKS[currentBookIndex];
      const reading = `${book.name} ${currentChapter}`;
      readings.set(dateString, reading);

      currentChapter++;

      // Move to next book if we've finished current book
      if (currentChapter > book.chapters) {
        currentBookIndex++;
        currentChapter = 1;
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return readings;
}

function updateKriyahFile(readings: Map<string, string>): void {
  const kriyahPath = path.join(__dirname, '../database/kriyah.ts');
  const content = fs.readFileSync(kriyahPath, 'utf8');

  // Parse the KRIYAH object
  const kriyahMatch = content.match(/export const KRIYAH: any = ({[\s\S]*});/);
  if (!kriyahMatch) {
    throw new Error('Could not find KRIYAH object in file');
  }

  const kriyahString = kriyahMatch[1];
  const kriyahData: KriyahData = eval(`(${kriyahString})`);

  // Update writings for each entry
  Object.keys(kriyahData).forEach(key => {
    const entry = kriyahData[key];
    const reading = readings.get(entry.date);
    if (reading) {
      entry.writings = reading;
    }
  });

  // Convert back to string
  const updatedContent = content.replace(
    /export const KRIYAH: any = {[\s\S]*};/,
    `export const KRIYAH: any = ${JSON.stringify(kriyahData, null, 2)};`
  );

  fs.writeFileSync(kriyahPath, updatedContent);
}

export function populateWritings(): void {
  console.log('=== Populating Writings Readings ===');

  try {
    // Find Simchat Torah dates for 2025
    const { start, end } = findSimchatTorahDates(2025);
    console.log(`Simchat Torah start: ${start.toISOString()}`);
    console.log(`Simchat Torah end: ${end.toISOString()}`);

    // Generate readings
    const readings = generateWritingsReadings(start, end);
    console.log(`Generated ${readings.size} readings`);

    // Update kriyah file
    updateKriyahFile(readings);
    console.log('Successfully updated kriyah.ts file');

    // Print some sample readings
    console.log('\nSample readings:');
    let count = 0;
    for (const [date, reading] of readings) {
      if (count < 10) {
        console.log(`${date}: ${reading}`);
        count++;
      } else {
        break;
      }
    }

  } catch (error) {
    console.error('Error populating writings:', error);
  }
}

// Run the script if called directly
if (require.main === module) {
  populateWritings();
}
