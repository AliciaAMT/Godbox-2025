import { KRIYAH } from '../database/kriyah';
import { ScriptureMappingService } from '../services/scripture-mapping.service';

interface DatabaseReading {
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

/**
 * Utility to update the database with correct Torah readings
 */
export function updateDatabaseWithScriptureReadings() {
  console.log('🔄 Starting database update with scripture readings...');

  const scriptureMappingService = new ScriptureMappingService();
  const updatedKriyah = { ...KRIYAH } as { [key: string]: DatabaseReading };

  let updatedCount = 0;

  // Get all available parashot from scripture mapping
  const availableParashot = scriptureMappingService.getAvailableParashot();
  console.log('📚 Available parashot:', availableParashot);

  // Update each reading in the database
  for (const [id, reading] of Object.entries(updatedKriyah)) {
    const parashah = reading.parashat;
    const kriyah = reading.kriyah;

    // Check if this parashah has scripture mappings
    if (availableParashot.includes(parashah)) {
      const scriptureReadings = scriptureMappingService.getScriptureReferences(parashah, kriyah);

      if (scriptureReadings && scriptureReadings.torah) {
        // Update the Torah reading with properly formatted reference
        const formattedTorahReference = scriptureMappingService.getFormattedReference(scriptureReadings.torah);
        updatedKriyah[id] = {
          ...reading,
          torah: formattedTorahReference
        };
        updatedCount++;

        // Also update prophets if available
        if (scriptureReadings.prophets) {
          const formattedProphetsReference = scriptureMappingService.getFormattedReference(scriptureReadings.prophets);
          updatedKriyah[id] = {
            ...updatedKriyah[id],
            prophets: formattedProphetsReference,
            haftarah: formattedProphetsReference
          };
        }
      }
    }
  }

  console.log(`✅ Updated ${updatedCount} readings with scripture references`);

  // Log some examples of updated readings
  const pinchasReadings = Object.values(updatedKriyah)
    .filter(reading => reading.parashat === 'Pinchas')
    .sort((a, b) => a.kriyah - b.kriyah);

  console.log('📖 Pinchas readings after update:');
  pinchasReadings.forEach(reading => {
    console.log(`  Day ${reading.kriyah}: ${reading.torah || 'No reading'}`);
  });

  return updatedKriyah;
}

/**
 * Generate the updated database content
 */
export function generateUpdatedDatabaseContent() {
  const updatedKriyah = updateDatabaseWithScriptureReadings();

  return `export const KRIYAH: any = ${JSON.stringify(updatedKriyah, null, 2)};`;
}

/**
 * Upload updated readings to Firebase (requires DataService instance)
 */
export async function uploadToFirebase(dataService: any) {
  console.log('🔥 Uploading updated readings to Firebase...');

  try {
    const updatedKriyah = updateDatabaseWithScriptureReadings();

    // Clear existing readings collection
    await dataService.clearReadingsCollection();
    console.log('✅ Cleared existing readings collection');

    // Convert to array format for Firebase
    const readingsArray = Object.values(updatedKriyah);
    console.log(`📊 Uploading ${readingsArray.length} readings to Firebase...`);

    // Upload each reading to Firebase
    let uploadedCount = 0;
    for (const reading of readingsArray) {
      try {
        await dataService.addReading(reading);
        uploadedCount++;

        if (uploadedCount % 50 === 0) {
          console.log(`📤 Uploaded ${uploadedCount}/${readingsArray.length} readings...`);
        }
      } catch (error) {
        console.error(`❌ Error uploading reading ${reading.idNo}:`, error);
      }
    }

    console.log(`✅ Successfully uploaded ${uploadedCount} readings to Firebase`);

    return {
      success: true,
      uploadedCount,
      totalCount: readingsArray.length,
      message: `Successfully uploaded ${uploadedCount} readings to Firebase 'readings' collection`
    };

  } catch (error) {
    console.error('❌ Error uploading to Firebase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to upload to Firebase'
    };
  }
}

/**
 * Create a downloadable file with the updated database content
 */
export function createDownloadableDatabaseFile() {
  const updatedContent = generateUpdatedDatabaseContent();

  // Create a blob with the updated content
  const blob = new Blob([updatedContent], { type: 'text/plain' });

  // Create a download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kriyah-updated.ts';
  link.textContent = 'Download Updated Database';

  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up
  URL.revokeObjectURL(url);

  console.log('📁 Database file download initiated');
  return updatedContent;
}

/**
 * Get the updated database content for manual replacement
 */
export function getUpdatedDatabaseContent() {
  const updatedContent = generateUpdatedDatabaseContent();

  console.log('📝 Updated database content ready for manual replacement:');
  console.log('Copy the content below and replace the content in src/app/database/kriyah.ts:');
  console.log('='.repeat(80));
  console.log(updatedContent);
  console.log('='.repeat(80));

  return updatedContent;
}
