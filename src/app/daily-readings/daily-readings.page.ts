import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { BibleApiService, BiblePassage } from '../services/bible-api.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { DateComponent } from '../components/date/date.component';
import { ReadingsService, DailyReadings } from '../services/readings.service';

@Component({
  selector: 'app-daily-readings',
  templateUrl: './daily-readings.page.html',
  styleUrls: ['./daily-readings.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonSpinner, CommonModule, FormsModule, RouterModule, FooterLandingComponent, MenuHeaderComponent, DateComponent]
})
export class DailyReadingsPage implements OnInit {
  dateS = new Date();
  today = formatDate(this.dateS, 'yyyy-MM-dd', 'en');
  readings: DailyReadings[] = [];
  isLoading = false;
  error: string | null = null;

  private bibleApiService = inject(BibleApiService);
  private readingsService = inject(ReadingsService);
  private cd = inject(ChangeDetectorRef);

  constructor() {
    // Use the same date calculation as before
    const now = new Date();
    this.dateS = now;
    this.today = formatDate(now, 'yyyy-MM-dd', 'en');

    console.log('Today\'s date:', this.today);
    console.log('🔍 App is looking for readings on date:', this.today);
    console.log('🔍 Current date object:', now);
    console.log('🔍 Current day of week:', now.getDay());
  }

  loadDailyReadings() {
    this.isLoading = true;
    this.error = null;

    // Use setTimeout to ensure Angular change detection is ready
    setTimeout(() => {
      try {
        // Get readings for today
        console.log('🔍 Getting readings for date:', this.dateS);
        console.log('🔍 Date object:', this.dateS);
        console.log('🔍 Date string:', this.dateS.toISOString());
        console.log('🔍 Day of week:', this.dateS.getDay());

        const todayReadings = this.readingsService.getDailyReadings(this.dateS);

        console.log('Dynamic readings found:', todayReadings);

        // Convert to array format for display
        this.readings = [todayReadings];
        this.isLoading = false;
        this.cd.detectChanges();

      } catch (error) {
        console.error('Error loading daily readings:', error);
        this.error = 'Error loading readings. Please try again.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    }, 0);
  }

  ngOnInit() {
    this.loadDailyReadings();
  }

  trackByReading(index: number, reading: DailyReadings): string {
    return reading.date;
  }

  async openGateway(id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    console.log('🔍 openGateway called with:', { id, kiriyah, referenceOverride });

    // If id is undefined, try to find the reading by other means
    if (!id) {
      console.log('🔍 No ID provided, using first reading as fallback');
      if (this.readings.length > 0) {
        const firstReading = this.readings[0];
        id = firstReading.date || 'fallback';
        console.log('🔍 Using fallback ID:', id);
      } else {
        console.error('❌ No readings available for fallback');
        return;
      }
    }

    if (id) {
      console.log('🔍 Opening gateway for:', id, kiriyah, referenceOverride ? `with override: ${referenceOverride}` : '');

      // Use the override reference if provided, otherwise find the reading by date
      let reference = referenceOverride;

      if (!reference) {
        // Find the reading by date
        const reading = this.readings.find(r => r.date === id?.toString());

        if (!reading) {
          console.error('❌ Reading not found for ID:', id);
          console.log('🔍 Available readings:', this.readings.map(r => ({ date: r.date, parashah: r.parashah })));

          // Use first reading as fallback
          if (this.readings.length > 0) {
            const fallbackReading = this.readings[0];
            console.log('🔍 Using fallback reading:', fallbackReading);

            // Get the scripture reference based on the type
            switch (kiriyah) {
              case 'torah':
                reference = fallbackReading.torah ? `${fallbackReading.torah.book} ${fallbackReading.torah.start}-${fallbackReading.torah.end}` : '';
                break;
              case 'prophets':
                reference = fallbackReading.prophets || '';
                break;
              case 'writings':
                reference = fallbackReading.writings || '';
                break;
              case 'britChadashah':
                reference = fallbackReading.britChadashah || '';
                break;
              case 'haftarah':
                reference = fallbackReading.haftarah || '';
                break;
              default:
                console.error('❌ Unknown kiriyah type:', kiriyah);
                return;
            }
          } else {
            return;
          }
        } else {
          console.log('🔍 Found reading:', reading);

          // Get the scripture reference based on the type
          switch (kiriyah) {
            case 'torah':
              reference = reading.torah ? `${reading.torah.book} ${reading.torah.start}-${reading.torah.end}` : '';
              break;
            case 'prophets':
              reference = reading.prophets || '';
              break;
            case 'writings':
              reference = reading.writings || '';
              break;
            case 'britChadashah':
              reference = reading.britChadashah || '';
              break;
            case 'haftarah':
              reference = reading.haftarah || '';
              break;
            default:
              console.error('❌ Unknown kiriyah type:', kiriyah);
              return;
          }
        }
      }

      console.log('🔍 Reference to fetch:', reference);

      if (!reference) {
        console.error('❌ No reference found for:', kiriyah);
        return;
      }

      console.log('🔍 About to call Bible API for reference:', reference);

      // Fetch the scripture passage from api.bible
      this.bibleApiService.getPassage(reference).subscribe({
        next: (passage) => {
          console.log('🔍 Bible API response:', passage);
          if (passage) {
            this.displayScripturePassage(passage, kiriyah);
          } else {
            this.showErrorMessage(`No passage found for ${kiriyah} reading`);
          }
        },
        error: (error) => {
          console.error('❌ Error fetching passage:', error);
          this.showErrorMessage(`Error fetching ${kiriyah} reading: ${error.message}`);
        }
      });
    }
  }

  handleReadingClick(event: Event, id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    event.preventDefault();
    event.stopPropagation();
    this.openGateway(id, kiriyah, referenceOverride);
  }

  private displayScripturePassage(passage: BiblePassage, type: string) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background-color: #1a1a1a;
      color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      max-width: 90%;
      max-height: 90%;
      width: 800px;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 1px solid #333;
    `;

    // Create header with close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #333;
    `;

    const title = document.createElement('h2');
    title.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Reading`;
    title.style.cssText = `
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: #ffffff;
      font-size: 28px;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      font-weight: bold;
    `;
    closeButton.setAttribute('aria-label', 'Close modal');
    closeButton.setAttribute('role', 'button');
    closeButton.setAttribute('tabindex', '0');

    // Add hover effect for close button
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#333';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });

    // Create scripture content
    const scriptureContainer = document.createElement('div');
    scriptureContainer.style.cssText = `
      background-color: #2a2a2a;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #444;
    `;

    const reference = document.createElement('h3');
    reference.textContent = passage.reference;
    reference.style.cssText = `
      color: #4CAF50;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: 600;
    `;

    const content = document.createElement('div');
    content.innerHTML = passage.content || passage.text || '';
    content.style.cssText = `
      line-height: 1.8;
      color: #e0e0e0;
      font-size: 16px;
      text-align: left;
    `;

    // Assemble the modal
    header.appendChild(title);
    header.appendChild(closeButton);
    scriptureContainer.appendChild(reference);
    scriptureContainer.appendChild(content);
    modalContent.appendChild(header);
    modalContent.appendChild(scriptureContainer);

    // Add close functionality
    const closeModal = () => {
      document.body.removeChild(modalOverlay);
      // Restore focus to the element that opened the modal
      const lastActiveElement = document.querySelector('[data-last-active]') as HTMLElement;
      if (lastActiveElement) {
        lastActiveElement.focus();
        lastActiveElement.removeAttribute('data-last-active');
      }
    };

    closeButton.addEventListener('click', closeModal);
    closeButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        closeModal();
      }
    });

    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    // Store the currently focused element
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.setAttribute('data-last-active', 'true');
    }

    // Add modal to page
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Focus the close button for accessibility
    setTimeout(() => {
      closeButton.focus();
    }, 100);
  }

  private showErrorMessage(message: string) {
    // Simple error display - you can enhance this with a proper toast or alert
    console.error(message);
    alert(message);
  }

  // Helper method to check if it's Sabbath
  isSabbath(reading: DailyReadings): boolean {
    // Parse the date string in local timezone to avoid UTC issues
    const [year, month, day] = reading.date.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const dayOfWeek = date.getDay();
    const isSabbath = dayOfWeek === 6; // Saturday
    console.log(`🔍 isSabbath check for ${reading.date}: parsed date=${date.toDateString()}, dayOfWeek=${dayOfWeek}, isSabbath=${isSabbath}`);
    return isSabbath;
  }

  // Helper method to get day name
  getDayName(reading: DailyReadings): string {
    // Parse the date string in local timezone to avoid UTC issues
    const [year, month, day] = reading.date.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }

  // Helper method to format Torah reading
  formatTorahReading(reading: DailyReadings): string {
    if (reading.torah) {
      return `${reading.torah.book} ${reading.torah.start}-${reading.torah.end}`;
    }
    return 'No Torah reading available';
  }
}
