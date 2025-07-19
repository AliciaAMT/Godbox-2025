import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SabbathReadingsService, SabbathReading } from '../../services/sabbath-readings.service';
import { HaftarahService } from '../../services/haftarah.service';

@Component({
  selector: 'app-sabbath-readings-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sabbath-readings-test">
      <h2>Sabbath Readings Test</h2>

      <div class="controls">
        <button (click)="loadTodayReadings()">Load Today's Readings</button>
        <button (click)="loadNextSabbath()">Load Next Sabbath</button>
        <button (click)="testHaftarahService()">Test Haftarah Service</button>
      </div>

      <div class="results" *ngIf="sabbathReadings.length > 0">
        <h3>Sabbath Readings Found: {{ sabbathReadings.length }}</h3>

        <div class="sabbath-reading" *ngFor="let reading of sabbathReadings">
          <h4>{{ reading.parashatEng }} ({{ reading.parashatHeb }})</h4>
          <p><strong>Date:</strong> {{ reading.sabbathDate }} ({{ reading.hebrewDate }})</p>
          <p><strong>Haftarah:</strong> {{ reading.haftarah || 'No haftarah found' }}</p>
          <p><strong>Complete Torah Reading:</strong> {{ reading.completeTorahReading || 'No readings found' }}</p>

          <div class="week-readings">
            <h5>Weekly Readings:</h5>
            <div class="daily-reading" *ngFor="let day of reading.weekReadings">
              <span class="day-name">{{ day.dayName }} ({{ day.day }})</span>
              <span class="date">{{ day.date }}</span>
              <span class="torah">{{ day.torahReading || 'No reading' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="haftarah-test" *ngIf="haftarahResults.length > 0">
        <h3>Haftarah Service Test Results</h3>
        <div class="haftarah-result" *ngFor="let result of haftarahResults">
          <strong>{{ result.parashah }}:</strong> {{ result.haftarah }}
        </div>
      </div>

      <div class="error" *ngIf="error">
        <p>Error: {{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .sabbath-readings-test {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .controls {
      margin-bottom: 20px;
    }

    .controls button {
      margin-right: 10px;
      padding: 8px 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .controls button:hover {
      background-color: #0056b3;
    }

    .sabbath-reading {
      border: 1px solid #ddd;
      margin-bottom: 20px;
      padding: 15px;
      border-radius: 8px;
      background-color: #f9f9f9;
    }

    .week-readings {
      margin-top: 15px;
    }

    .daily-reading {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
    }

    .daily-reading:last-child {
      border-bottom: none;
    }

    .day-name {
      font-weight: bold;
      width: 120px;
    }

    .date {
      width: 100px;
      color: #666;
    }

    .torah {
      flex: 1;
      margin-left: 10px;
    }

    .haftarah-test {
      margin-top: 30px;
      padding: 15px;
      background-color: #e8f4fd;
      border-radius: 8px;
    }

    .haftarah-result {
      margin: 5px 0;
    }

    .error {
      color: red;
      padding: 10px;
      background-color: #ffe6e6;
      border-radius: 4px;
      margin-top: 10px;
    }
  `]
})
export class SabbathReadingsTestComponent implements OnInit {
  sabbathReadings: SabbathReading[] = [];
  haftarahResults: { parashah: string; haftarah: string }[] = [];
  error: string = '';

  constructor(
    private sabbathReadingsService: SabbathReadingsService,
    private haftarahService: HaftarahService
  ) {}

  ngOnInit() {
    this.loadTodayReadings();
  }

  loadTodayReadings() {
    try {
      this.error = '';
      this.sabbathReadings = this.sabbathReadingsService.getSabbathReadingsForToday();
      console.log('Today\'s Sabbath readings:', this.sabbathReadings);
    } catch (err) {
      this.error = `Error loading today's readings: ${err}`;
      console.error('Error loading today\'s readings:', err);
    }
  }

  loadNextSabbath() {
    try {
      this.error = '';
      const nextSabbath = this.sabbathReadingsService.getNextSabbathReading();
      this.sabbathReadings = nextSabbath ? [nextSabbath] : [];
      console.log('Next Sabbath reading:', nextSabbath);
    } catch (err) {
      this.error = `Error loading next Sabbath: ${err}`;
      console.error('Error loading next Sabbath:', err);
    }
  }

  testHaftarahService() {
    try {
      this.error = '';
      const parashot = this.haftarahService.getAvailableParashot();
      this.haftarahResults = parashot.slice(0, 10).map(parashah => ({
        parashah,
        haftarah: this.haftarahService.getHaftarahReference(parashah)
      }));
      console.log('Haftarah test results:', this.haftarahResults);
    } catch (err) {
      this.error = `Error testing haftarah service: ${err}`;
      console.error('Error testing haftarah service:', err);
    }
  }
}
