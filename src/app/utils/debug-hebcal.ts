import { HebrewCalendar, Location } from '@hebcal/core';

export function debugHebCalEvents() {
  console.log('=== Debugging hebCal Events ===');

  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());

  const events = HebrewCalendar.calendar({
    start: startDate,
    end: endDate,
    location: Location.lookup('Jerusalem'),
    sedrot: true,
    candlelighting: false
  });

  console.log('Total events found:', events.length);

  events.forEach((event, index) => {
    const desc = event.getDesc();
    const basename = event.basename();
    const date = event.getDate().greg();

    console.log(`Event ${index + 1}:`, {
      description: desc,
      basename: basename,
      date: date.toISOString(),
      isParashat: desc && desc.includes('Parashat')
    });
  });

  const parashotEvents = events.filter(event => {
    const desc = event.getDesc();
    return desc && desc.includes('Parashat');
  });

  console.log('Parashot events found:', parashotEvents.length);
  parashotEvents.forEach((event, index) => {
    console.log(`Parashah ${index + 1}:`, event.basename(), 'on', event.getDate().greg().toISOString());
  });
}
