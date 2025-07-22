import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HebrewCalendar, HDate } from '@hebcal/core';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DateComponent implements OnInit, OnDestroy {
  monthname: any;
  d: any;
  month: any;
  days: string = '';
  hebDate: string = '';
  gregorianDate: string = '';
  hebrewTime: string = '';
  currentParashah: string = '';
  currentHoliday: string = '';
  private intervalId: any;

  constructor() {
    this.updateDateTime();
  }

  ngOnInit() {
    // Update time every minute
    this.intervalId = setInterval(() => {
      this.updateDateTime();
    }, 60000); // Update every minute
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateDateTime() {
    const now = new Date();

    try {
      // Use hebcal for Hebrew date
      const hDate = new HDate(now);

      // Hebrew date
      this.hebDate = hDate.toString();

      // Get current parashah and holiday
      this.getCurrentEvents(hDate);
    } catch (error) {
      console.log('Error with hebcal, using fallback:', error);
      // Fallback Hebrew date using Intl
      this.hebDate = new Intl.DateTimeFormat('en-u-ca-hebrew', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now);
      this.currentParashah = '';
      this.currentHoliday = '';
    }

    // Gregorian date
    this.gregorianDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Hebrew time
    this.hebrewTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Day of week
    const days = [
      'Yom Rishon - Discipleship',
      'Yom Sh\'ní - Joyful Effort',
      'Yom Sh\'lishí - Charity',
      'Yom Rvi\'í - Skillfulness',
      'Yom Ch\'mishí - Health',
      'Yom Shishí - Fellowship',
      'Shabbat - Holy'
    ];
    this.days = days[now.getDay()];
  }

  private getCurrentEvents(hDate: HDate) {
    try {
      // Get events for today using the correct hebCal API
      const events = HebrewCalendar.calendar({
        start: hDate.greg(),
        end: hDate.greg(),
        sedrot: true,
        candlelighting: false
      });

      // Find parashah
      const parashahEvent = events.find((event: any) => {
        const desc = event.getDesc();
        return desc && desc.includes('Parashat');
      });
      this.currentParashah = parashahEvent ? parashahEvent.basename() : '';

      // Find holiday
      const holidayEvent = events.find((event: any) => {
        const desc = event.getDesc();
        return desc && (desc.includes('Holiday') || desc.includes('Rosh Chodesh'));
      });
      this.currentHoliday = holidayEvent ? holidayEvent.basename() : '';
    } catch (error) {
      console.log('Error getting Hebrew events:', error);
      this.currentParashah = '';
      this.currentHoliday = '';
    }
  }
}
