import { ParashahService } from '../services/parashah.service';
import { ScriptureMappingService } from '../services/scripture-mapping.service';

export function testGeneratedCode() {
  const scriptureMappingService = new ScriptureMappingService();
  const parashahService = new ParashahService(scriptureMappingService);

  // Test with a small date range
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  const readings = parashahService.generateReadings(startDate, endDate);
  const generatedCode = parashahService.generateDatabaseFile(readings);

  console.log('=== Testing Generated Code ===');
  console.log('Readings generated:', readings.length);
  console.log('Code length:', generatedCode.length);
  console.log('First 500 characters:');
  console.log(generatedCode.substring(0, 500));

  // Test if the code can be evaluated (basic syntax check)
  try {
    // Create a function that would execute the code
    const testFunction = new Function('return ' + generatedCode);
    const result = testFunction();
    console.log('✅ Code is syntactically valid!');
    console.log('Result type:', typeof result);
    console.log('Result keys:', Object.keys(result).length);
    return true;
  } catch (error) {
    console.error('❌ Code has syntax errors:', error);
    return false;
  }
}
