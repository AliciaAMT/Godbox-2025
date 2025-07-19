import { updateKriyahDatabase } from './update-kriyah-database';

/**
 * Script to update the kriyah database with new haftarah readings
 * Run this script to update the kriyah.ts file with complete readings
 */
async function main() {
  console.log('🚀 Starting kriyah database update...');
  console.log('📅 This will generate readings for the next year with haftarah');
  console.log('⏳ Please wait...\n');

  try {
    const result = await updateKriyahDatabase();
    console.log('\n✅ Database update completed successfully!');
    console.log('📁 Updated file: src/app/database/kriyah.ts');
    console.log('🔄 You can now use the updated database with haftarah readings');

    // Show a sample of what was generated
    console.log('\n📋 Sample of updated readings:');
    const lines = result.split('\n').slice(0, 20);
    lines.forEach(line => console.log(line));
    console.log('... (truncated)');

  } catch (error) {
    console.error('\n❌ Database update failed:', error);
    process.exit(1);
  }
}

// Run the update
main();
