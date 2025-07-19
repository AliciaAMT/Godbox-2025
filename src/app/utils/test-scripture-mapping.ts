import { ParashahService } from '../services/parashah.service';
import { ScriptureMappingService } from '../services/scripture-mapping.service';

export function testScriptureMapping() {
  const scriptureMappingService = new ScriptureMappingService();
  const parashahService = new ParashahService(scriptureMappingService);

  console.log('=== Testing Scripture Mapping ===');

  // Test available parashot
  const availableParashot = scriptureMappingService.getAvailableParashot();
  console.log('Available parashot:', availableParashot.length);
  console.log('First 5 parashot:', availableParashot.slice(0, 5));

  // Test scripture references for a specific parashah
  const testParashah = 'Vayigash';
  console.log(`\nTesting scripture references for ${testParashah}:`);

  for (let day = 1; day <= 7; day++) {
    const readings = scriptureMappingService.getScriptureReferences(testParashah, day);
    if (readings) {
      console.log(`Day ${day}:`);
      console.log(`  Torah: ${readings.torah.reference}`);
      if (readings.prophets) {
        console.log(`  Prophets: ${readings.prophets.reference}`);
      }
      if (readings.writings) {
        console.log(`  Writings: ${readings.writings.reference}`);
      }
      if (readings.britChadashah) {
        console.log(`  Brit Chadashah: ${readings.britChadashah.reference}`);
      }
    }
  }

  // Test generating readings with scripture references
  console.log('\n=== Testing Generated Readings with Scripture References ===');
  const startDate = new Date('2025-01-04'); // Vayigash week
  const endDate = new Date('2025-01-10');

  const readings = parashahService.generateReadings(startDate, endDate);
  console.log(`Generated ${readings.length} readings`);

  // Show first few readings with scripture references
  readings.slice(0, 3).forEach((reading, index) => {
    console.log(`\nReading ${index + 1}:`);
    console.log(`  Date: ${reading.date}`);
    console.log(`  Parashah: ${reading.parashat}`);
    console.log(`  Kriyah: ${reading.kriyah}`);
    console.log(`  Torah: ${reading.torah}`);
    console.log(`  Prophets: ${reading.prophets}`);
    console.log(`  Writings: ${reading.writings}`);
    console.log(`  Brit Chadashah: ${reading.britChadashah}`);
  });

  return true;
}
