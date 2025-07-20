const { HebrewCalendar, Location } = require('@hebcal/core');

function findSimchatTorahDates() {
  console.log('=== Finding Simchat Torah Dates ===');

  // Check multiple years
  for (let year = 2024; year <= 2026; year++) {
    console.log(`\nChecking ${year}...`);
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

    console.log(`Found ${simchatTorahEvents.length} Simchat Torah events in ${year}:`);
    simchatTorahEvents.forEach(event => {
      const date = event.getDate().greg();
      console.log(`  ${date.toISOString().split('T')[0]}: ${event.getDesc()}`);
    });
  }
}

findSimchatTorahDates();
