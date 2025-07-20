import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { BibleApiService, BiblePassage } from '../services/bible-api.service';
import { ESVApiService, ESVPassage } from '../services/esv-api.service';
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
  private esvApiService = inject(ESVApiService);
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

      console.log('🔍 About to call API for reference:', reference);

      // Always try ESV API first if configured
      if (this.esvApiService.isApiKeyConfigured()) {
        console.log('🔍 ESV API key configured, trying ESV API first');
        this.esvApiService.getPassage(reference).subscribe({
          next: (passage) => {
            console.log('🔍 ESV API response:', passage);
            if (passage) {
              console.log('✅ ESV API successful, displaying ESV passage');
              this.displayESVScripturePassage(passage, kiriyah);
            } else {
              // ESV API returned null, try Bible API as fallback
              console.log('❌ ESV API returned null, trying Bible API as fallback');
              this.showErrorMessage(`ESV API could not find passage for: ${reference}. Trying Bible API...`);
              this.fetchWithBibleAPI(reference, kiriyah);
            }
          },
          error: (error) => {
            console.error('❌ Error fetching ESV passage:', error);
            // ESV API failed, try Bible API as fallback
            console.log('🔍 ESV API error, trying Bible API as fallback');
            this.showErrorMessage(`ESV API error: ${error.message}. Trying Bible API as fallback...`);
            this.fetchWithBibleAPI(reference, kiriyah);
          }
        });
      } else {
        // ESV API key not configured, use Bible API with warning
        console.log('🔍 ESV API not configured, using Bible API');
        this.showErrorMessage('ESV API key not configured. Using Bible API instead.');
        this.fetchWithBibleAPI(reference, kiriyah);
      }
    }
  }

  handleReadingClick(event: Event, id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    event.preventDefault();
    event.stopPropagation();
    this.openGateway(id, kiriyah, referenceOverride);
  }

  /**
   * Fetch passage using Bible API (fallback method)
   */
  private fetchWithBibleAPI(reference: string, kiriyah: string) {
    console.log('🔍 Using Bible API as fallback for reference:', reference);
    this.bibleApiService.getPassage(reference).subscribe({
      next: (passage) => {
        console.log('🔍 Bible API response:', passage);
        if (passage) {
          console.log('✅ Bible API fallback successful');
          this.displayScripturePassage(passage, kiriyah);
        } else {
          console.log('❌ Bible API fallback also failed');
          this.showErrorMessage(`No passage found for ${kiriyah} reading using Bible API fallback`);
        }
      },
      error: (error) => {
        console.error('❌ Error fetching passage with Bible API fallback:', error);
        this.showErrorMessage(`Both ESV API and Bible API failed for ${kiriyah} reading: ${error.message}`);
      }
    });
  }

  /**
   * Display ESV scripture passage in modal
   */
  private displayESVScripturePassage(passage: ESVPassage, kiriyah: string) {
    console.log('🔍 Displaying ESV passage:', passage);

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
    title.textContent = this.getReadingTypeName(kiriyah);
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
    content.className = 'scripture-content';

    // Format the content with superscript verse numbers
    const formattedContent = this.formatVerseNumbers(passage.content || passage.text || '');
    console.log('ESV Formatted content:', formattedContent);

    content.innerHTML = formattedContent;
    content.style.cssText = `
      line-height: 1.8;
      color: #e0e0e0;
      font-size: 16px;
      text-align: left;
    `;

    // Add CSS styles for superscript verse numbers directly to the modal
    const style = document.createElement('style');
    style.textContent = `
      .scripture-content sup {
        font-size: 0.7em;
        vertical-align: super;
        line-height: 0;
        color: #4CAF50;
        font-weight: 600;
        margin-right: 3px;
        position: relative;
        top: -0.2em;
        display: inline-block;
        font-family: inherit;
      }
    `;
    modalContent.appendChild(style);

    // Add ESV Bible attribution
    const footer = document.createElement('div');
    footer.style.cssText = `
      text-align: center;
      padding-top: 15px;
      border-top: 1px solid #333;
      color: #888;
      font-size: 14px;
    `;
    footer.textContent = 'ESV Bible';

    // Assemble the modal
    header.appendChild(title);
    header.appendChild(closeButton);
    scriptureContainer.appendChild(reference);
    scriptureContainer.appendChild(content);
    modalContent.appendChild(header);
    modalContent.appendChild(scriptureContainer);
    modalContent.appendChild(footer);

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
    closeButton.focus();
  }

  /**
   * Get the display name for reading type
   */
  private getReadingTypeName(kiriyah: string): string {
    switch (kiriyah) {
      case 'torah':
        return 'Torah Reading';
      case 'prophets':
        return 'Prophets Reading';
      case 'writings':
        return 'Writings Reading';
      case 'britChadashah':
        return 'Brit Chadashah Reading';
      case 'haftarah':
        return 'Haftarah Reading';
      default:
        return 'Scripture Reading';
    }
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
    let displayTitle = type.charAt(0).toUpperCase() + type.slice(1);
    if (type === 'britChadashah') {
      displayTitle = 'Brit Chadashah';
    } else if (type === 'prophets') {
      displayTitle = 'Nevi\'im';
    } else if (type === 'writings') {
      displayTitle = 'Ketuvim';
    }
    title.textContent = `${displayTitle} Reading (Bible API Fallback)`;
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
    content.className = 'scripture-content';

    // Debug: Log the raw content to see what format the verse numbers are in
    console.log('Raw passage content:', passage.content);
    console.log('Raw passage text:', passage.text);

    // Format the content with superscript verse numbers
    const formattedContent = this.formatVerseNumbers(passage.content || passage.text || '');
    console.log('Formatted content:', formattedContent);

    content.innerHTML = formattedContent;
    content.style.cssText = `
      line-height: 1.8;
      color: #e0e0e0;
      font-size: 16px;
      text-align: left;
    `;

    // Add CSS styles for superscript verse numbers directly to the modal
    const style = document.createElement('style');
    style.textContent = `
      .scripture-content sup {
        font-size: 0.7em;
        vertical-align: super;
        line-height: 0;
        color: #4CAF50;
        font-weight: 600;
        margin-right: 3px;
        position: relative;
        top: -0.2em;
        display: inline-block;
        font-family: inherit;
      }
    `;
    modalContent.appendChild(style);

    // Add Bible API attribution footer
    const footer = document.createElement('div');
    footer.style.cssText = `
      text-align: center;
      padding-top: 15px;
      border-top: 1px solid #333;
      color: #888;
      font-size: 14px;
    `;
    footer.textContent = 'Bible API (Fallback)';

    // Assemble the modal
    header.appendChild(title);
    header.appendChild(closeButton);
    scriptureContainer.appendChild(reference);
    scriptureContainer.appendChild(content);
    modalContent.appendChild(header);
    modalContent.appendChild(scriptureContainer);
    modalContent.appendChild(footer);

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

            /**
   * Format verse numbers as superscript in the scripture text
   */
  private formatVerseNumbers(text: string): string {
    if (!text) return '';

    console.log('Formatting verse numbers in text:', text.substring(0, 200));

    // The Bible API returns verse numbers in <span class="v"> tags
    // We need to convert these to superscript format
    let formatted = text;

    // Convert <span class="v">number</span> to <sup>number</sup>
    formatted = formatted.replace(/<span[^>]*class="v"[^>]*>(\d+)<\/span>/g, '<sup>$1</sup>');

    // Also handle any other span tags with data-number attribute
    formatted = formatted.replace(/<span[^>]*data-number="[^"]*"[^>]*>(\d+)<\/span>/g, '<sup>$1</sup>');

    console.log('Formatted result:', formatted.substring(0, 200));

    return formatted;
  }

  /**
   * Test ESV API configuration
   */
  testESVBible() {
    console.log('Testing ESV API configuration...');
    this.esvApiService.testConnection().subscribe({
      next: (success) => {
        if (success) {
          console.log('✅ ESV API test successful');
          alert('ESV API test successful! ESV Bible is working.');
        } else {
          console.log('❌ ESV API test failed');
          alert('ESV API test failed. Check console for details.');
        }
      },
      error: (error) => {
        console.error('ESV API test error:', error);
        alert('ESV API test error. Check console for details.');
      }
    });
  }

    /**
   * Check what Bible translation each ID represents
   */
  checkBibleTranslations() {
    console.log('Checking Bible translations...');

    const bibleIds = [
      'de4e12af7f28f599-02', // Current ESV ID
      '65eec8e0b60e656b-01', // KJV
      '9879dbb7cfe39e4d-01', // NASB
      '179568874c45066f-01', // NKJV
    ];

    bibleIds.forEach(bibleId => {
      this.bibleApiService.getBibleInfo(bibleId).subscribe({
        next: (info) => {
          if (info && info.data) {
            console.log(`Bible ID ${bibleId}:`, info.data.name, info.data.language?.name);
          }
        },
        error: (error) => {
          console.error(`Error getting info for ${bibleId}:`, error);
        }
      });
    });
  }

  /**
   * Test ESV passage retrieval
   */
  findESVBible() {
    console.log('Testing ESV passage retrieval...');

    // Test with a simple, known-working reference first
    console.log('🔍 Testing ESV API with John 3:16...');
    this.esvApiService.testSpecificReference('John 3:16').subscribe({
      next: (response) => {
        console.log('ESV John 3:16 test completed:', response);
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ ESV API works with John 3:16');
          alert('ESV API works with John 3:16! Now testing Matthew 9...');

          // Now test the problematic reference
          this.esvApiService.testSpecificReference('Matthew 9').subscribe({
            next: (matthewResponse) => {
              console.log('ESV Matthew 9 test completed:', matthewResponse);
              if (matthewResponse && matthewResponse.passages && matthewResponse.passages.length > 0) {
                console.log('✅ ESV API works with Matthew 9');
                alert('ESV API works with Matthew 9!');
              } else {
                console.log('❌ ESV API failed with Matthew 9');
                alert('ESV API failed with Matthew 9. Check console for details.');
              }
            },
            error: (error) => {
              console.error('ESV Matthew 9 test error:', error);
              alert('ESV Matthew 9 test error. Check console for details.');
            }
          });
        } else {
          console.log('❌ ESV API failed with John 3:16');
          alert('ESV API failed with John 3:16. Check console for details.');
        }
      },
      error: (error) => {
        console.error('ESV John 3:16 test error:', error);
        alert('ESV John 3:16 test error. Check console for details.');
      }
    });
  }

  /**
   * Test minimal ESV API
   */
  testMinimalESV() {
    console.log('Testing minimal ESV API...');
    this.esvApiService.testMinimalESV().subscribe({
      next: (response) => {
        console.log('Minimal ESV API test completed:', response);
        if (response && response.passages && response.passages.length > 0) {
          console.log('✅ Minimal ESV API works');
          alert('Minimal ESV API works! Check console for details.');
        } else {
          console.log('❌ Minimal ESV API failed');
          alert('Minimal ESV API failed. Check console for details.');
        }
      },
      error: (error) => {
        console.error('Minimal ESV API test error:', error);
        alert('Minimal ESV API test error. Check console for details.');
      }
    });
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
