const { HebrewCalendar, Location } = require('@hebcal/core');

function checkHebcalOptions() {
  console.log('=== Checking hebCal Options for Haftarah ===');

  try {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-31');

    // Try different hebCal options
    const options = [
      { sedrot: true, candlelighting: false },
      { sedrot: true, candlelighting: false, haftarah: true },
      { sedrot: true, candlelighting: false, haftara: true },
      { sedrot: true, candlelighting: false, readings: true },
      { sedrot: true, candlelighting: false, parsha: true }
    ];

    options.forEach((option, index) => {
      console.log(`\n=== Option ${index + 1}: ${JSON.stringify(option)} ===`);

      try {
        const events = HebrewCalendar.calendar({
          start: startDate,
          end: endDate,
          location: Location.lookup('Jerusalem'),
          ...option
        });

        console.log(`Found ${events.length} events`);

        // Look for any reading-related events
        const readingEvents = [];
        events.forEach(event => {
          const desc = event.getDesc();
          if (desc.includes('Haftarah') || desc.includes('haftarah') ||
              desc.includes('Haftara') || desc.includes('haftara') ||
              desc.includes('Reading') || desc.includes('reading')) {
            readingEvents.push({
              date: event.getDate().greg().toISOString().split('T')[0],
              description: desc
            });
          }
        });

        if (readingEvents.length > 0) {
          console.log('Reading events found:');
          readingEvents.forEach(event => {
            console.log(`  ${event.date}: ${event.description}`);
          });
        } else {
          console.log('No reading events found');
        }

      } catch (error) {
        console.log(`Error with option ${index + 1}: ${error.message}`);
      }
    });

    // Check if there are any other hebCal modules or functions
    console.log('\n=== Available hebCal Exports ===');
    console.log('HebrewCalendar:', typeof HebrewCalendar);
    console.log('Location:', typeof Location);

    // Try to access any other hebCal modules
    try {
      const hebcal = require('@hebcal/core');
      console.log('All hebCal exports:', Object.keys(hebcal));
    } catch (error) {
      console.log('Could not access all hebCal exports');
    }

  } catch (error) {
    console.error('Error checking hebCal options:', error);
    console.error(error.stack);
  }
}

// Run the check
checkHebcalOptions();
