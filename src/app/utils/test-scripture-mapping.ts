import { updateDatabaseWithScriptureReadings, generateUpdatedDatabaseContent, createDownloadableDatabaseFile, getUpdatedDatabaseContent, uploadToFirebase } from './update-database';

/**
 * Test script to update database with scripture readings
 */
export function testScriptureMapping() {
  console.log('🧪 Testing scripture mapping and database update...');

  try {
    // Test the update function
    const updatedKriyah = updateDatabaseWithScriptureReadings();

    // Generate the new database content
    const newDatabaseContent = generateUpdatedDatabaseContent();

    console.log('\n✅ Database update completed successfully!');
    console.log(`📊 Total readings updated: ${Object.keys(updatedKriyah).length}`);

    // Show a preview of the updated content
    console.log('\n📝 Database content preview (first 1000 chars):');
    console.log(newDatabaseContent.substring(0, 1000) + '...');

    return {
      success: true,
      updatedKriyah,
      newDatabaseContent,
      message: 'Database update completed successfully'
    };

  } catch (error) {
    console.error('❌ Error updating database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Database update failed'
    };
  }
}

/**
 * Upload updated readings to Firebase
 */
export async function uploadToFirebaseCollection(dataService: any) {
  console.log('🔥 Uploading updated readings to Firebase collection...');

  try {
    const result = await uploadToFirebase(dataService);

    if (result.success) {
      console.log('✅ Firebase upload completed successfully!');
      console.log(`📊 Uploaded ${result.uploadedCount}/${result.totalCount} readings`);
    } else {
      console.error('❌ Firebase upload failed:', result.error);
    }

    return result;

  } catch (error) {
    console.error('❌ Error in Firebase upload:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Firebase upload failed'
    };
  }
}

/**
 * Download the updated database file
 */
export function downloadUpdatedDatabase() {
  console.log('📁 Downloading updated database file...');

  try {
    const content = createDownloadableDatabaseFile();

    return {
      success: true,
      message: 'Database file download initiated. Check your downloads folder for kriyah-updated.ts'
    };

  } catch (error) {
    console.error('❌ Error downloading database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Database download failed'
    };
  }
}

/**
 * Show the updated database content for manual replacement
 */
export function showUpdatedDatabaseContent() {
  console.log('📝 Showing updated database content for manual replacement...');

  try {
    const content = getUpdatedDatabaseContent();

    return {
      success: true,
      content,
      message: 'Database content shown in console. Copy and replace src/app/database/kriyah.ts content.'
    };

  } catch (error) {
    console.error('❌ Error showing database content:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: 'Failed to show database content'
    };
  }
}

// Export for use in other files
export { updateDatabaseWithScriptureReadings, generateUpdatedDatabaseContent };
