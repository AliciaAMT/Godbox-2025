import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { BibleApiService, BiblePassage } from '../services/bible-api.service';
import { ESVApiService, ESVPassage } from '../services/esv-api.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { DateComponent } from '../components/date/date.component';
import { ReadingsService, DailyReadings } from '../services/readings.service';
import { Auth } from '@angular/fire/auth';
import { DataService, User } from '../services/data.service';

@Component({
  selector: 'app-daily-readings',
  templateUrl: './daily-readings.page.html',
  styleUrls: ['./daily-readings.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, IonSpinner, CommonModule, FormsModule, RouterModule, FooterLandingComponent, BackButtonComponent, DateComponent]
})
export class DailyReadingsPage implements OnInit {
  dateS = new Date();
  today = formatDate(this.dateS, 'yyyy-MM-dd', 'en');
  readings: DailyReadings[] = [];
  isLoading = false;
  error: string | null = null;
  bibleVersion: string = 'ESV';
  user: User | null = null;

  private bibleApiService = inject(BibleApiService);
  private esvApiService = inject(ESVApiService);
  private readingsService = inject(ReadingsService);
  private cd = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private dataService = inject(DataService);

  constructor() {
    const now = new Date();
    this.dateS = now;
    this.today = formatDate(now, 'yyyy-MM-dd', 'en');
  }

  loadDailyReadings() {
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      try {
        const todayReadings = this.readingsService.getDailyReadings(this.dateS);
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
    // Fetch current user and their bibleVersion
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      this.dataService.getUserById(currentUser.uid).subscribe(user => {
        this.user = user;
        if (user && user.bibleVersion) {
          this.bibleVersion = user.bibleVersion;
        } else {
          this.bibleVersion = 'ESV'; // Default to ESV if not set
        }
      });
    } else {
      this.bibleVersion = 'ESV'; // Default to ESV if not logged in
    }
  }

  trackByReading(index: number, reading: DailyReadings): string {
    return reading.date;
  }

  async openGateway(id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    if (!id) {
      if (this.readings.length > 0) {
        const firstReading = this.readings[0];
        id = firstReading.date || 'fallback';
      } else {
        return;
      }
    }

    if (id) {
      let reference = referenceOverride;

      if (!reference) {
        const reading = this.readings.find(r => r.date === id?.toString());

        if (!reading) {
          if (this.readings.length > 0) {
            const fallbackReading = this.readings[0];
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
                return;
            }
          } else {
            return;
          }
        } else {
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
              return;
          }
        }
      }

      if (!reference) {
        return;
      }

      // Use bibleVersion to select API
      if (this.bibleVersion === 'ESV') {
        if (this.esvApiService.isApiKeyConfigured()) {
          this.esvApiService.getPassage(reference).subscribe({
            next: (passage) => {
              if (passage) {
                this.displayESVScripturePassage(passage, kiriyah);
              } else {
                this.showErrorMessage(`ESV API could not find passage for: ${reference}. Trying Bible API...`);
                this.fetchWithBibleAPI(reference, kiriyah);
              }
            },
            error: (error) => {
              this.showErrorMessage(`ESV API error: ${error.message}. Trying Bible API as fallback...`);
              this.fetchWithBibleAPI(reference, kiriyah);
            }
          });
        } else {
          this.showErrorMessage('ESV API key not configured. Using Bible API instead.');
          this.fetchWithBibleAPI(reference, kiriyah);
        }
      } else if (this.bibleVersion === 'HBSS') {
        // Use The Holy Bible in Simple Spanish for Spanish
        this.bibleApiService.getPassage(reference, 'b32b9d1b64b4ef29-01').subscribe({
          next: (passage) => {
            if (passage) {
              this.displayScripturePassage(passage, kiriyah);
            } else {
              this.showErrorMessage(`No passage found for ${kiriyah} reading using Spanish Bible`);
            }
          },
          error: (error) => {
            this.showErrorMessage(`Spanish Bible API error: ${error.message}`);
          }
        });
      } else if (this.bibleVersion === 'KJV') {
        // Use default (KJV) Bible ID
        this.fetchWithBibleAPI(reference, kiriyah);
      } else if (this.bibleVersion === 'RVR09') {
        // Use Reina-Valera 1909 for Spanish
        this.bibleApiService.getPassage(reference, '592420522e16049f-01').subscribe({
          next: (passage) => {
            if (passage) {
              this.displayScripturePassage(passage, kiriyah);
            } else {
              this.showErrorMessage(`No passage found for ${kiriyah} reading using RVR09 Bible`);
            }
          },
          error: (error) => {
            this.showErrorMessage(`RVR09 Bible API error: ${error.message}`);
          }
        });
      } else {
        // Default fallback
        this.fetchWithBibleAPI(reference, kiriyah);
      }
    }
  }

  handleReadingClick(event: Event, id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    event.preventDefault();
    event.stopPropagation();
    this.openGateway(id, kiriyah, referenceOverride);
  }

  private fetchWithBibleAPI(reference: string, kiriyah: string) {
    this.bibleApiService.getPassage(reference).subscribe({
      next: (passage) => {
        if (passage) {
          this.displayScripturePassage(passage, kiriyah);
        } else {
          this.showErrorMessage(`No passage found for ${kiriyah} reading using Bible API fallback`);
        }
      },
      error: (error) => {
        this.showErrorMessage(`Both ESV API and Bible API failed for ${kiriyah} reading: ${error.message}`);
      }
    });
  }

  private displayESVScripturePassage(passage: ESVPassage, kiriyah: string) {
    // Log the raw HTML for inspection
    console.log('ESV raw passage HTML:', passage.content || passage.text || '');
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

    // Audio button (ESV only)
    const audioButton = document.createElement('button');
    audioButton.textContent = '🔊 Hear Passage';
    audioButton.style.cssText = `
      background: #222;
      color: #4CAF50;
      border: 1px solid #4CAF50;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      display: inline-block;
    `;
    audioButton.setAttribute('aria-label', 'Play ESV passage audio');
    let audio: HTMLAudioElement | null = null;
    let isPlaying = false;
    let isLoadingAudio = false;
    const spinner = document.createElement('span');
    spinner.textContent = '⏳';
    spinner.style.display = 'none';
    spinner.style.marginLeft = '8px';
    audioButton.appendChild(spinner);
    audioButton.onclick = async () => {
      if (isPlaying && audio) {
        audio.pause();
        isPlaying = false;
        audioButton.textContent = '🔊 Hear Passage';
        audioButton.appendChild(spinner);
        return;
      }
      if (!audio) {
        isLoadingAudio = true;
        spinner.style.display = 'inline-block';
        audioButton.disabled = true;
        // Fetch ESV audio URL from Firebase proxy
        try {
          const passageRef = encodeURIComponent(passage.reference);
          const audioUrl = `https://us-central1-the-way-417.cloudfunctions.net/esvAudio?q=${passageRef}`;
          const response = await fetch(audioUrl, {
            redirect: 'follow'
          });
          if (!response.ok) throw new Error('Audio fetch failed');
          const blob = await response.blob();
          const finalUrl = URL.createObjectURL(blob);
          audio = new Audio(finalUrl);
          audio.onended = () => {
            isPlaying = false;
            audioButton.textContent = '🔊 Hear Passage';
            audioButton.appendChild(spinner);
          };
          audio.onerror = () => {
            isPlaying = false;
            audioButton.textContent = '🔊 Hear Passage';
            audioButton.appendChild(spinner);
            alert('Failed to play audio.');
          };
        } catch (e) {
          alert('Could not load ESV audio.');
          isLoadingAudio = false;
          spinner.style.display = 'none';
          audioButton.disabled = false;
          return;
        }
        isLoadingAudio = false;
        spinner.style.display = 'none';
        audioButton.disabled = false;
      }
      if (audio) {
        audio.play();
        isPlaying = true;
        audioButton.textContent = '⏸ Pause Audio';
        audioButton.appendChild(spinner);
      }
    };
    modalContent.appendChild(audioButton);

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

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#333';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });

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

    const formattedContent = this.formatVerseNumbers(passage.content || passage.text || '');
    content.innerHTML = formattedContent;
    content.style.cssText = `
      line-height: 1.8;
      color: #e0e0e0;
      font-size: 16px;
      text-align: left;
    `;

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
      .scripture-content .woc {
        color: #ff5252;
        font-weight: 600;
      }
    `;
    modalContent.appendChild(style);

    const footer = document.createElement('div');
    footer.style.cssText = `
      text-align: center;
      padding-top: 15px;
      border-top: 1px solid #333;
      color: #888;
      font-size: 14px;
    `;
    footer.textContent = 'ESV Bible';

    header.appendChild(title);
    header.appendChild(closeButton);
    scriptureContainer.appendChild(reference);
    scriptureContainer.appendChild(content);
    modalContent.appendChild(header);
    modalContent.appendChild(scriptureContainer);
    modalContent.appendChild(footer);

    const closeModal = () => {
      document.body.removeChild(modalOverlay);
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

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.setAttribute('data-last-active', 'true');
    }

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    closeButton.focus();
  }

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
    // Only show (Bible API Fallback) if not KJV or Spanish
    let suffix = '';
    if (this.bibleVersion !== 'KJV' && this.bibleVersion !== 'HBSS' && this.bibleVersion !== 'RVR09') {
      suffix = ' (Bible API Fallback)';
    }
    title.textContent = `${displayTitle} Reading${suffix}`;
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

    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#333';
    });
    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
    });

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

    const formattedContent = this.formatVerseNumbers(passage.content || passage.text || '');
    content.innerHTML = formattedContent;
    content.style.cssText = `
      line-height: 1.8;
      color: #e0e0e0;
      font-size: 16px;
      text-align: left;
    `;

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

    const footer = document.createElement('div');
    footer.style.cssText = `
      text-align: center;
      padding-top: 15px;
      border-top: 1px solid #333;
      color: #888;
      font-size: 14px;
    `;
    footer.textContent = 'Bible API (Fallback)';

    header.appendChild(title);
    header.appendChild(closeButton);
    scriptureContainer.appendChild(reference);
    scriptureContainer.appendChild(content);
    modalContent.appendChild(header);
    modalContent.appendChild(scriptureContainer);
    modalContent.appendChild(footer);

    const closeModal = () => {
      document.body.removeChild(modalOverlay);
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

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });

    const activeElement = document.activeElement as HTMLElement;
    if (activeElement) {
      activeElement.setAttribute('data-last-active', 'true');
    }

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    setTimeout(() => {
      closeButton.focus();
    }, 100);
  }

  private formatVerseNumbers(text: string): string {
    if (!text) return '';

    // Remove ESV API's book/chapter title (e.g., <h2 class="extra_text">Matthew 11</h2>)
    let formatted = text.replace(/<h2[^>]*class="extra_text"[^>]*>.*?<\/h2>/gi, '');

    // Replace ESV verse numbers: <b class="verse-num" ...> or <b class="verse-num woc" ...>
    formatted = formatted.replace(/<b[^>]*class="verse-num(?: woc)?"[^>]*>(\d+)&nbsp;<\/b>/g, '<sup>$1</sup>');

    // Also handle any <span class="v">...</span> (for compatibility)
    formatted = formatted.replace(/<span[^>]*class="v"[^>]*>(\d+)<\/span>/g, '<sup>$1</sup>');
    formatted = formatted.replace(/<span[^>]*data-number="[^"]*"[^>]*>(\d+)<\/span>/g, '<sup>$1</sup>');

    return formatted;
  }

  private showErrorMessage(message: string) {
    console.error(message);
    alert(message);
  }

  isSabbath(reading: DailyReadings): boolean {
    const [year, month, day] = reading.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 6;
  }

  getDayName(reading: DailyReadings): string {
    const [year, month, day] = reading.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }

  formatTorahReading(reading: DailyReadings): string {
    if (reading.torah) {
      return `${reading.torah.book} ${reading.torah.start}-${reading.torah.end}`;
    }
    return 'No Torah reading available';
  }
}
