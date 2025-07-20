const { HebrewCalendar, Location } = require('@hebcal/core');

function researchHebcalHaftarah() {
  console.log('=== Researching hebCal Haftarah Data ===');

  try {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-12-31');

    const events = HebrewCalendar.calendar({
      start: startDate,
      end: endDate,
      location: Location.lookup('Jerusalem'),
      sedrot: true,
      candlelighting: false
    });

    console.log(`Found ${events.length} events for 2025`);

    // Look for Haftarah related events
    const haftarahEvents = [];
    const otherEvents = [];

    events.forEach(event => {
      const desc = event.getDesc();
      const date = event.getDate().greg();
      const dateString = date.toISOString().split('T')[0];

      if (desc.includes('Haftarah') || desc.includes('haftarah') || desc.includes('Haftara')) {
        haftarahEvents.push({
          date: dateString,
          description: desc,
          event: event
        });
      } else if (desc.includes('Parashat')) {
        otherEvents.push({
          date: dateString,
          description: desc,
          event: event
        });
      }
    });

    console.log('\n=== Haftarah Events ===');
    haftarahEvents.forEach(event => {
      console.log(`${event.date}: ${event.description}`);
    });

    console.log('\n=== Parashat Events ===');
    otherEvents.forEach(event => {
      console.log(`${event.date}: ${event.description}`);
    });

    // Check if there are any properties or methods that might contain Haftarah data
    if (haftarahEvents.length > 0) {
      console.log('\n=== Sample Haftarah Event Properties ===');
      const sampleEvent = haftarahEvents[0].event;
      console.log('Event properties:', Object.keys(sampleEvent));
      console.log('Event methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sampleEvent)));
      console.log('Event type:', sampleEvent.constructor.name);
      console.log('Event description:', sampleEvent.getDesc());
    }

    // Try to find any Haftarah-related data in the events
    console.log('\n=== Checking All Events for Haftarah References ===');
    let haftarahCount = 0;
    events.forEach(event => {
      const desc = event.getDesc();
      if (desc.toLowerCase().includes('haftarah') || desc.toLowerCase().includes('haftara')) {
        haftarahCount++;
        const date = event.getDate().greg();
        const dateString = date.toISOString().split('T')[0];
        console.log(`${dateString}: ${desc}`);
      }
    });

    console.log(`\nTotal Haftarah references found: ${haftarahCount}`);

  } catch (error) {
    console.error('Error researching hebCal Haftarah data:', error);
    console.error(error.stack);
  }
}

// Run the research
researchHebcalHaftarah();
