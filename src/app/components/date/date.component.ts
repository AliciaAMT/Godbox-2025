import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      const hebcal = require('hebcal');
      const hDate = new hebcal.HDate(now);

      // Hebrew date
      this.hebDate = hDate.toString('h');

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
    const hours = now.getHours();
    const minutes = now.getMinutes();
    this.hebrewTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

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

  private getCurrentEvents(hDate: any) {
    try {
      // Get events for today
      const hebcal = require('hebcal');
      const events = hebcal.HebrewCalendar.getEvents(hDate);

      // Find parashah
      const parashahEvent = events.find((event: any) => event.type === 'parasha');
      this.currentParashah = parashahEvent ? parashahEvent.render() : '';

      // Find holiday
      const holidayEvent = events.find((event: any) =>
        event.type === 'holiday' ||
        event.type === 'yomtov' ||
        event.type === 'roshchodesh'
      );
      this.currentHoliday = holidayEvent ? holidayEvent.render() : '';
    } catch (error) {
      console.log('Error getting Hebrew events:', error);
      this.currentParashah = '';
      this.currentHoliday = '';
    }
  }
}
