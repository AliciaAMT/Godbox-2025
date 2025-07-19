import { HaftarahService } from '../services/haftarah.service';
import { SabbathReadingsService } from '../services/sabbath-readings.service';
import { ParashahService } from '../services/parashah.service';

/**
 * Test script for Sabbath readings and haftarah services
 */
export async function testSabbathReadings() {
  console.log('=== Testing Sabbath Readings and Haftarah Services ===\n');

  // Test Haftarah Service
  console.log('1. Testing Haftarah Service:');
  const haftarahService = new HaftarahService();

  const testParashot = ['Bereshit', 'Noach', 'Lech Lecha', 'Vayera', 'Chayei Sarah'];

  for (const parashah of testParashot) {
    const haftarah = haftarahService.getHaftarahReference(parashah);
    console.log(`   ${parashah}: ${haftarah}`);
  }

  console.log(`\n   Total parashot with haftarah: ${haftarahService.getAvailableParashot().length}\n`);

  // Test Sabbath Readings Service
  console.log('2. Testing Sabbath Readings Service:');

  // Note: In a real environment, we'd need to inject the dependencies
  // For now, we'll just test the haftarah service standalone
  console.log('   (Sabbath Readings Service requires dependency injection - test in component)\n');

  // Test Parashah Service with haftarah integration
  console.log('3. Testing Parashah Service with Haftarah Integration:');

  // Note: In a real environment, we'd need to inject the dependencies
  // For now, we'll just show what the integration looks like
  console.log('   (Parashah Service with haftarah integration requires dependency injection)\n');

  // Generate sample data
  console.log('4. Sample Haftarah Data:');
  const allParashot = haftarahService.getAvailableParashot();
  const sampleData = allParashot.slice(0, 10).map(parashah => ({
    parashah,
    haftarah: haftarahService.getHaftarahReference(parashah),
    description: haftarahService.getHaftarahDescription(parashah)
  }));

  console.log('   Sample haftarah mappings:');
  sampleData.forEach(item => {
    console.log(`   - ${item.parashah}: ${item.haftarah} (${item.description})`);
  });

  console.log('\n=== Test Complete ===');
}

/**
 * Generate sample Sabbath reading data
 */
export function generateSampleSabbathData() {
  const haftarahService = new HaftarahService();
  const parashot = haftarahService.getAvailableParashot().slice(0, 5);

  const sampleSabbathData = parashot.map((parashah, index) => ({
    idNo: index + 1,
    parashat: parashah,
    parashatHeb: getParashahHebrew(parashah),
    parashatEng: getParashahEnglish(parashah),
    sabbathDate: `2025-01-${(index + 1) * 7}`,
    hebrewDate: `7 Tevet 5785`,
    weekReadings: generateSampleWeekReadings(parashah),
    haftarah: haftarahService.getHaftarahReference(parashah),
    haftarahReference: haftarahService.getHaftarahReference(parashah),
    completeTorahReading: generateSampleCompleteTorahReading(parashah)
  }));

  return sampleSabbathData;
}

function getParashahHebrew(parashah: string): string {
  const translations: { [key: string]: string } = {
    'Bereshit': 'בראשית',
    'Noach': 'נח',
    'Lech Lecha': 'לך לך',
    'Vayera': 'וירא',
    'Chayei Sarah': 'חיי שרה'
  };
  return translations[parashah] || parashah;
}

function getParashahEnglish(parashah: string): string {
  const translations: { [key: string]: string } = {
    'Bereshit': 'In the Beginning',
    'Noach': 'Noah',
    'Lech Lecha': 'Go Forth',
    'Vayera': 'He Appeared',
    'Chayei Sarah': 'Life of Sarah'
  };
  return translations[parashah] || parashah;
}

function generateSampleWeekReadings(parashah: string) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sampleReadings = {
    'Bereshit': ['Genesis 1:1-5', 'Genesis 1:6-8', 'Genesis 1:9-13', 'Genesis 1:14-19', 'Genesis 1:20-23', 'Genesis 1:24-31', 'Genesis 2:1-3'],
    'Noach': ['Genesis 6:9-22', 'Genesis 7:1-16', 'Genesis 7:17-23', 'Genesis 7:24-8:4', 'Genesis 8:5-14', 'Genesis 8:15-22', 'Genesis 9:1-7'],
    'Lech Lecha': ['Genesis 12:1-9', 'Genesis 12:10-20', 'Genesis 13:1-18', 'Genesis 14:1-20', 'Genesis 14:21-24', 'Genesis 15:1-11', 'Genesis 15:12-21'],
    'Vayera': ['Genesis 18:1-14', 'Genesis 18:15-33', 'Genesis 19:1-20', 'Genesis 19:21-38', 'Genesis 20:1-18', 'Genesis 21:1-21', 'Genesis 21:22-34'],
    'Chayei Sarah': ['Genesis 23:1-20', 'Genesis 24:1-27', 'Genesis 24:28-52', 'Genesis 24:53-67', 'Genesis 25:1-11', 'Genesis 25:12-18', 'Genesis 25:19-34']
  };

  const readings = sampleReadings[parashah as keyof typeof sampleReadings] || Array(7).fill('No reading available');

  return dayNames.map((dayName, index) => ({
    day: index + 1,
    dayName,
    date: `2025-01-${index + 1}`,
    torahReading: readings[index],
    torahReference: readings[index]
  }));
}

function generateSampleCompleteTorahReading(parashah: string): string {
  const sampleReadings = {
    'Bereshit': 'Genesis 1:1-5; Genesis 1:6-8; Genesis 1:9-13; Genesis 1:14-19; Genesis 1:20-23; Genesis 1:24-31; Genesis 2:1-3',
    'Noach': 'Genesis 6:9-22; Genesis 7:1-16; Genesis 7:17-23; Genesis 7:24-8:4; Genesis 8:5-14; Genesis 8:15-22; Genesis 9:1-7',
    'Lech Lecha': 'Genesis 12:1-9; Genesis 12:10-20; Genesis 13:1-18; Genesis 14:1-20; Genesis 14:21-24; Genesis 15:1-11; Genesis 15:12-21',
    'Vayera': 'Genesis 18:1-14; Genesis 18:15-33; Genesis 19:1-20; Genesis 19:21-38; Genesis 20:1-18; Genesis 21:1-21; Genesis 21:22-34',
    'Chayei Sarah': 'Genesis 23:1-20; Genesis 24:1-27; Genesis 24:28-52; Genesis 24:53-67; Genesis 25:1-11; Genesis 25:12-18; Genesis 25:19-34'
  };

  return sampleReadings[parashah as keyof typeof sampleReadings] || 'No readings available';
}
