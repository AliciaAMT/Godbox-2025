import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HebrewCalendar, HDate } from '@hebcal/core';
import { HolidayModalComponent } from '../holiday-modal/holiday-modal.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: true,
  imports: [CommonModule, HolidayModalComponent]
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
  isModalOpen: boolean = false;
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

  onHolidayClick() {
    if (this.currentHoliday) {
      this.isModalOpen = true;
    }
  }

  onCloseModal() {
    this.isModalOpen = false;
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

      // Find holiday - prioritize Rosh Chodesh
      let holidayEvent = events.find((event: any) => {
        const desc = event.getDesc();
        return desc && desc.includes('Rosh Chodesh');
      });

      if (!holidayEvent) {
        holidayEvent = events.find((event: any) => {
          const desc = event.getDesc();
          return desc && desc.includes('Holiday');
        });
      }

      if (holidayEvent) {
        const desc = holidayEvent.getDesc();
        if (desc && desc.includes('Rosh Chodesh')) {
          // Format Rosh Chodesh with the month name
          const monthName = this.getHebrewMonthName(hDate);
          this.currentHoliday = `Rosh Chodesh ${monthName}`;
        } else {
          this.currentHoliday = holidayEvent.basename();
        }
      } else {
        this.currentHoliday = '';
      }
    } catch (error) {
      console.log('Error getting Hebrew events:', error);
      this.currentParashah = '';
      this.currentHoliday = '';
    }
  }

  private getHebrewMonthName(hDate: HDate): string {
    const monthNames = [
      'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
      'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar'
    ];

    // Get the month number (0-based)
    const month = hDate.getMonth();
    return monthNames[month] || 'Unknown';
  }
}
