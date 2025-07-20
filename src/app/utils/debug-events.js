const { HebrewCalendar, Location } = require('@hebcal/core');

function debugEvents() {
  console.log('=== Debugging hebCal Events ===');

  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-31');

  const events = HebrewCalendar.calendar({
    start: startDate,
    end: endDate,
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });

  console.log(`Found ${events.length} total events`);

  // Show all events with their descriptions
  events.forEach((event, index) => {
    const desc = event.getDesc();
    const date = event.getDate().greg();
    console.log(`${index + 1}. ${date.toISOString().split('T')[0]}: ${desc}`);
  });
}

debugEvents();
