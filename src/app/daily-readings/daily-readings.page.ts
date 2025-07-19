import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { DataService, Readings } from '../services/data.service';
import { BibleApiService, BiblePassage } from '../services/bible-api.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { DateComponent } from '../components/date/date.component';
import { ParashahService } from '../services/parashah.service';
import { EnhancedDailyReadingsService, EnhancedReading } from '../services/enhanced-daily-readings.service';
import { FirebaseUpdaterService } from '../services/firebase-updater.service';
import { ScriptureMappingService } from '../services/scripture-mapping.service';
import { FixAllDatabaseFormatsService } from '../utils/fix-all-database-formats';

@Component({
  selector: 'app-daily-readings',
  templateUrl: './daily-readings.page.html',
  styleUrls: ['./daily-readings.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton, CommonModule, FormsModule, RouterModule, FooterLandingComponent, MenuHeaderComponent, DateComponent]
})
export class DailyReadingsPage implements OnInit {
  dateS = new Date();
  today = formatDate(this.dateS, 'yyyy-MM-dd', 'en');
  readings: EnhancedReading[] = [];
  isSabbath = false;

  private dataService = inject(DataService);
  private bibleApiService = inject(BibleApiService);
  private parashahService = inject(ParashahService);
  private enhancedReadingsService = inject(EnhancedDailyReadingsService);
  private firebaseUpdaterService = inject(FirebaseUpdaterService);
  private cd = inject(ChangeDetectorRef);
  private scriptureMappingService = inject(ScriptureMappingService);
  private fixAllDatabaseFormatsService = inject(FixAllDatabaseFormatsService);

  constructor() {
    console.log('Today\'s date:', this.today);
    console.log('🔍 App is looking for readings on date:', this.today);
    this.loadEnhancedReadings();
  }

  private loadEnhancedReadings() {
    this.enhancedReadingsService.getEnhancedDailyReadings().subscribe(res => {
      console.log('Enhanced readings found:', res);
      console.log('Enhanced readings count:', res.length);

      res.forEach((reading, index) => {
        console.log(`Enhanced Reading ${index}:`, {
          id: reading.id,
          idNo: reading.idNo,
          date: reading.date,
          isSabbath: reading.isSabbath,
          torah: reading.torah,
          prophets: reading.prophets,
          haftarah: reading.haftarah,
          haftarahReference: reading.haftarahReference,
          completeTorahReading: reading.completeTorahReading
        });

        // Log the exact haftarah values for debugging
        if (reading.isSabbath) {
          console.log('🔍 Sabbath reading haftarah debug:', {
            haftarah: reading.haftarah,
            prophets: reading.prophets,
            haftarahReference: reading.haftarahReference,
            haftarahType: typeof reading.haftarah,
            prophetsType: typeof reading.prophets
          });
        }
      });

      this.readings = res;
      this.isSabbath = res.some(reading => reading.isSabbath);
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
  }

  trackByReading(index: number, reading: EnhancedReading): number {
    return reading.idNo || index;
  }

  async openGateway(id: string | number | undefined, kiriyah: string, referenceOverride?: string) {
    if (id) {
      console.log('Opening gateway for:', id, kiriyah, referenceOverride ? `with override: ${referenceOverride}` : '');

      // Use the override reference if provided, otherwise find the reading by ID
      let reference = referenceOverride;

      if (!reference) {
        // Find the reading by ID
        const reading = this.readings.find(r => r.idNo?.toString() === id?.toString());
        if (!reading) {
          console.error('Reading not found for ID:', id);
          return;
        }

        // Get the scripture reference based on the type
        switch (kiriyah) {
          case 'torah':
            reference = reading.torah;
            break;
          case 'prophets':
            reference = reading.prophets;
            break;
          case 'writings':
            reference = reading.writings;
            break;
          case 'britChadashah':
            reference = reading.britChadashah;
            break;
          default:
            console.error('Unknown kiriyah type:', kiriyah);
            return;
        }
      }

      if (!reference) {
        console.error('No reference found for:', kiriyah);
        return;
      }

      // Fetch the scripture passage from api.bible
      this.bibleApiService.getPassage(reference).subscribe({
        next: (passage) => {
          if (passage) {
            // Display the passage in a modal or alert
            this.displayScripturePassage(passage, kiriyah);
          } else {
            console.error('Failed to fetch passage for:', reference);
            this.showErrorMessage(`Unable to fetch scripture for ${reference}. Please check your internet connection and try again.`);
          }
        },
        error: (error) => {
          console.error('Error fetching scripture:', error);
          this.showErrorMessage(`Error loading scripture for ${reference}. Please try again later.`);
        }
      });
    }
  }

  testApiConnection() {
    console.log('Testing API connection...');
    this.bibleApiService.testApiConnection().subscribe({
      next: (success) => {
        if (success) {
          this.showSuccessMessage('API connection successful!');
        } else {
          this.showErrorMessage('API connection failed. Please check your API key and internet connection.');
        }
      },
      error: (error) => {
        console.error('API test error:', error);
        this.showErrorMessage('API test failed: ' + error.message);
      }
    });
  }

  /**
   * Test basic API connectivity with a simple verse
   */
  testBasicApiConnectivity() {
    console.log('Testing basic API connectivity...');

    // Test with the simplest possible passage
    this.bibleApiService.getPassage('Genesis 1:1').subscribe({
      next: (passage) => {
        if (passage) {
          console.log('✅ Basic API connectivity works!', passage);
          console.log('Passage verses:', passage.verses);
          console.log('First verse details:', JSON.stringify(passage.verses[0], null, 2));

          // Extract text from passage or verses
          let text = passage.text || '';
          if (!text && passage.verses && passage.verses.length > 0) {
            text = passage.verses[0].text || '';
          }
          // If still no text, try to extract from content (if available)
          if (!text && (passage as any).content) {
            text = (passage as any).content.replace(/<[^>]*>/g, '').trim();
            console.log('Extracted text from content:', text);
          }
          // If still no text, try to extract from the raw API response
          if (!text) {
            console.log('No text found in passage, checking raw API response...');
            // For now, let's manually extract the text from the content property
            const content = (passage as any).content;
            if (content) {
              console.log('Found content property:', content);
              text = content.replace(/<[^>]*>/g, '').trim();
              console.log('Extracted text from content:', text);
            } else {
              console.log('No content property found in passage');
              // Since we know the API returns content, let's try to access it directly
              console.log('Passage object keys:', Object.keys(passage));
              console.log('Full passage object:', passage);
              // For now, let's use a hardcoded text for testing
              text = "In the beginning God created the heaven and the earth.";
              console.log('Using hardcoded text for testing:', text);
            }
          }
          console.log('Final text for preview:', text);

          const textPreview = text ? text.substring(0, 50) : 'No text available';
          this.showSuccessMessage(`API connectivity works! Test passage: ${textPreview}...`);
        } else {
          console.log('❌ Basic API connectivity failed - no result');
          this.showErrorMessage('Basic API connectivity failed - no result returned');
        }
      },
      error: (error) => {
        console.log('❌ Basic API connectivity failed:', error);
        this.showErrorMessage(`Basic API connectivity failed: ${error.status} ${error.statusText}`);
      }
    });
  }

  /**
   * Test different reference formats for the Numbers passage
   */
  testReferenceFormats() {
    console.log('Testing reference formats for Numbers 25:10-18...');
    this.bibleApiService.testReferenceFormats('Numbers 25:10-18').subscribe({
      next: (result) => {
        if (result) {
          console.log('Successful format found:', result.format);
          this.showSuccessMessage(`Found working format: ${result.format}`);
        } else {
          console.log('No working format found');
          this.showErrorMessage('No working format found for Numbers 25:10-18');
        }
      },
      error: (error) => {
        console.error('Error testing formats:', error);
        this.showErrorMessage('Error testing reference formats');
      }
    });
  }

  /**
   * Find Bible IDs that support Numbers
   */
  findBibleIdsWithNumbers() {
    console.log('Finding Bible IDs that support Numbers...');
    this.bibleApiService.findBibleIdsWithNumbers().subscribe({
      next: (result) => {
        if (result) {
          console.log('Numbers support search result:', result);
          const supporting = result.supportingNumbers;
          const notSupporting = result.notSupportingNumbers;

          if (supporting.length > 0) {
            this.showSuccessMessage(`Found ${supporting.length} Bibles that support Numbers! Check console for details.`);
          } else {
            this.showErrorMessage(`None of the ${result.totalTested} tested Bibles support Numbers. Check console for details.`);
          }
        } else {
          console.log('No Numbers support search results');
          this.showErrorMessage('No Numbers support search results');
        }
      },
      error: (error) => {
        console.error('Error searching for Numbers support:', error);
        this.showErrorMessage('Error searching for Numbers support');
      }
    });
  }

  /**
   * Test KJV Numbers with different abbreviations
   */
  testKJVNumbers() {
    console.log('Testing KJV Numbers with different abbreviations...');
    this.bibleApiService.testKJVNumbers().subscribe({
      next: (result) => {
        if (result) {
          console.log('KJV Numbers test result:', result);
          const successful = result.successful;
          const failed = result.failed;
          if (successful.length > 0) {
            this.showSuccessMessage(`KJV Numbers test: ${successful.length} formats work! Check console for details.`);
          } else {
            this.showErrorMessage(`KJV Numbers test: All ${failed.length} formats failed. Check console for details.`);
          }
        } else {
          console.log('No KJV Numbers test results');
          this.showErrorMessage('No KJV Numbers test results');
        }
      },
      error: (error) => {
        console.error('Error testing KJV Numbers:', error);
        this.showErrorMessage('Error testing KJV Numbers');
      }
    });
  }

  /**
   * Test Numbers support across all Bible IDs
   */
  testNumbersAcrossAllBibleIds() {
    console.log('Testing Numbers support across all Bible IDs...');
    this.bibleApiService.testNumbersAcrossAllBibleIds().subscribe({
      next: (result) => {
        if (result) {
          console.log('Numbers support test result:', result);
          const successful = result.successful;
          const failed = result.failed;
          if (successful.length > 0) {
            this.showSuccessMessage(`Numbers support: ${successful.length} Bible IDs support Numbers! Check console for details.`);
          } else {
            this.showErrorMessage(`Numbers support: All ${failed.length} Bible IDs do not support Numbers. Check console for details.`);
          }
        } else {
          console.log('No Numbers support test results');
          this.showErrorMessage('No Numbers support test results');
        }
      },
      error: (error) => {
        console.error('Error testing Numbers support:', error);
        this.showErrorMessage('Error testing Numbers support');
      }
    });
  }

  /**
   * Test if Numbers book exists in current Bible ID
   */
  testNumbersBook() {
    console.log('Testing Numbers book...');
    this.bibleApiService.testNumbersBook().subscribe({
      next: (result) => {
        if (result) {
          console.log('Numbers book test result:', result);
          const successful = result.successful;
          const failed = result.failed;
          if (successful.length > 0) {
            this.showSuccessMessage(`Numbers book test: ${successful.length} verses work, ${failed.length} failed. Check console for details.`);
          } else {
            this.showErrorMessage(`Numbers book test: All ${failed.length} verses failed. Check console for details.`);
          }
        } else {
          console.log('No Numbers book test results');
          this.showErrorMessage('No Numbers book test results');
        }
      },
      error: (error) => {
        console.error('Error testing Numbers book:', error);
        this.showErrorMessage('Error testing Numbers book');
      }
    });
  }

  /**
   * Test which Bible IDs are available with the current API key
   */
  testAvailableBibleIds() {
    console.log('Testing available Bible IDs...');
    this.bibleApiService.testAvailableBibleIds().subscribe({
      next: (results) => {
        if (results) {
          console.log('Bible ID test results:', results);
          const workingIds = results.filter((r: any) => r.status === 'success');
          if (workingIds.length > 0) {
            this.showSuccessMessage(`Found ${workingIds.length} working Bible IDs! Check console for details.`);
          } else {
            this.showErrorMessage('No working Bible IDs found. Check console for details.');
          }
        } else {
          console.log('No Bible ID test results');
          this.showErrorMessage('No Bible ID test results');
        }
      },
      error: (error) => {
        console.error('Error testing Bible IDs:', error);
        this.showErrorMessage('Error testing Bible IDs');
      }
    });
  }

  /**
   * Test different Bible IDs and formats
   */
  testDifferentBibleIds() {
    console.log('Testing different Bible IDs and formats...');

    // Test with a simple, well-known passage
    const testPassages = [
      'Genesis 1:1',
      'John 3:16',
      'Psalm 23:1',
      'Numbers 25:10-18'
    ];

    testPassages.forEach(passage => {
      console.log(`Testing passage: ${passage}`);
      this.bibleApiService.getPassage(passage).subscribe({
        next: (result) => {
          if (result) {
            console.log(`✅ SUCCESS: ${passage}`, result.reference);
          } else {
            console.log(`❌ FAILED: ${passage} - No result`);
          }
        },
        error: (error) => {
          console.log(`❌ ERROR: ${passage}`, error.status, error.statusText);
        }
      });
    });

    this.showSuccessMessage('Testing different Bible IDs and passages. Check console for results.');
  }

  /**
   * Test with a different passage to see if the issue is specific to Numbers 25
   */
  testDifferentPassage() {
    console.log('Testing with a different passage: Genesis 1:1-5...');
    this.bibleApiService.getPassage('Genesis 1:1-5').subscribe({
      next: (passage) => {
        if (passage) {
          console.log('Genesis passage successful:', passage);
          this.showSuccessMessage(`Genesis passage works! Reference: ${passage.reference}`);
        } else {
          console.log('Genesis passage failed');
          this.showErrorMessage('Genesis passage also failed');
        }
      },
      error: (error) => {
        console.error('Error testing Genesis passage:', error);
        this.showErrorMessage('Error testing Genesis passage');
      }
    });
  }

  /**
   * Test API configuration and list available Bibles
   */
  testApiConfiguration() {
    console.log('Testing API configuration...');
    this.bibleApiService.testApiConfiguration().subscribe({
      next: (result) => {
        if (result) {
          console.log('API configuration successful:', result);
          this.showSuccessMessage('API configuration works! Check console for available Bibles.');
        } else {
          console.log('API configuration failed');
          this.showErrorMessage('API configuration failed');
        }
      },
      error: (error) => {
        console.error('Error testing API configuration:', error);
        this.showErrorMessage('Error testing API configuration');
      }
    });
  }

  /**
   * Test verses endpoint
   */
  testVersesEndpoint() {
    console.log('Testing verses endpoint...');
    this.bibleApiService.testVersesEndpoint().subscribe({
      next: (result) => {
        if (result) {
          console.log('Verses endpoint successful:', result);
          this.showSuccessMessage('Verses endpoint works! Check console for details.');
        } else {
          console.log('Verses endpoint failed');
          this.showErrorMessage('Verses endpoint failed');
        }
      },
      error: (error) => {
        console.error('Error testing verses endpoint:', error);
        this.showErrorMessage('Error testing verses endpoint');
      }
    });
  }

  /**
   * Test formatReferenceForApi method
   */
  testFormatReference() {
    console.log('Testing formatReferenceForApi method...');

    const testReferences = [
      'Genesis 1:1-5',
      'Numbers 25:10-18',
      'Numbers 25:10-30',
      'Gen 1:1',
      'Num 25:10'
    ];

    testReferences.forEach(ref => {
      const result = this.bibleApiService.testFormatReference(ref);
      console.log(`"${ref}" -> "${result}"`);
    });

    this.showSuccessMessage('Format reference test completed. Check console for results.');
  }

    /**
   * Regenerate database with enhanced readings including haftarah and complete Torah readings for Sabbath
   */
  async regenerateDatabase() {
    try {
      console.log('🔄 Regenerating database with enhanced readings...');

      // Use the Firebase updater service to update Firebase
      await this.firebaseUpdaterService.updateFirebaseWithEnhancedReadings();

      // Reload readings
      this.loadEnhancedReadings();

      this.showSuccessMessage('Successfully updated Firebase database with enhanced readings including haftarah and complete Torah readings for Sabbath!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to regenerate database:', error);
      this.showErrorMessage(`Failed to regenerate database: ${errorMessage}`);
    }
  }

  private showSuccessMessage(message: string) {
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 400px;
      text-align: center;
      position: relative;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #4caf50;">Success</h3>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
      </div>
      <p style="margin: 0; line-height: 1.5;">${message}</p>
    `;

    alert.appendChild(content);
    document.body.appendChild(alert);

    // Close on background click
    alert.addEventListener('click', (e) => {
      if (e.target === alert) {
        alert.remove();
      }
    });
  }

  private showErrorMessage(message: string) {
    const alert = document.createElement('div');
    alert.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      max-width: 400px;
      text-align: center;
      position: relative;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0; color: #d32f2f;">Error</h3>
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
      </div>
      <p style="margin: 0; line-height: 1.5;">${message}</p>
    `;

    alert.appendChild(content);
    document.body.appendChild(alert);

    // Close on background click
    alert.addEventListener('click', (e) => {
      if (e.target === alert) {
        alert.remove();
      }
    });
  }

      private displayScripturePassage(passage: BiblePassage, type: string) {
    console.log('🔍 displayScripturePassage called with:', {
      reference: passage.reference,
      textLength: passage.text?.length || 0,
      textPreview: passage.text?.substring(0, 100),
      versesCount: passage.verses?.length || 0,
      type: type
    });

    const typeNames = {
      'torah': 'Torah',
      'prophets': 'Prophets',
      'writings': 'Writings',
      'britChadashah': 'Brit Chadashah'
    };

    // Create accessible modal with more robust styling
    const modal = document.createElement('div');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'scripture-modal-title');
    modal.setAttribute('aria-describedby', 'scripture-modal-content');

    // Apply styles individually to ensure they take effect
    modal.style.position = 'fixed';
    modal.style.top = '0px';
    modal.style.left = '0px';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.zIndex = '999999';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.padding = '20px';
    modal.style.backdropFilter = 'blur(2px)';
    modal.style.pointerEvents = 'auto';

        const content = document.createElement('div');
    content.style.cssText = `
      background: #1a1a1a;
      color: #ffffff;
      padding: 0;
      border-radius: 12px;
      max-width: 90vw;
      max-height: 90vh;
      width: 800px;
      height: 600px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      border: 1px solid #333;
    `;

    content.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 24px 32px; border-bottom: 1px solid #333; background: #2a2a2a;">
        <h2 id="scripture-modal-title" style="margin: 0; font-size: 2rem; color: #ffffff; font-weight: 600;">${typeNames[type as keyof typeof typeNames] || type}</h2>
        <button
          id="close-modal-btn"
          onclick="this.closest('[role=dialog]').remove()"
          style="background: #444; border: 1px solid #555; color: #fff; font-size: 20px; cursor: pointer; padding: 12px; border-radius: 8px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-weight: bold;"
          onmouseover="this.style.backgroundColor='#666'; this.style.borderColor='#777';"
          onmouseout="this.style.backgroundColor='#444'; this.style.borderColor='#555';"
          onfocus="this.style.backgroundColor='#666'; this.style.borderColor='#777';"
          onblur="this.style.backgroundColor='#444'; this.style.borderColor='#555';"
          aria-label="Close scripture passage"
        >×</button>
      </div>
      <div id="scripture-modal-content" style="padding: 32px; height: calc(100% - 100px); overflow-y: auto; background: #1a1a1a;">
        <h3 style="color: #cccccc; margin-bottom: 24px; font-size: 1.4rem; font-weight: 500;">${passage.reference}</h3>
        <div style="line-height: 1.8; font-size: 18px; white-space: pre-wrap; color: #ffffff; font-family: 'Georgia', serif; text-align: justify;">${passage.text || 'No text available'}</div>
      </div>
    `;

    console.log('🔍 Modal content HTML preview:', content.innerHTML.substring(0, 200));
    console.log('🔍 Passage text length:', passage.text?.length || 0);
    console.log('🔍 Passage text preview:', passage.text?.substring(0, 100));

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Debug modal visibility
    console.log('🔍 Modal element created:', modal);
    console.log('🔍 Modal style.display:', modal.style.display);
    console.log('🔍 Modal z-index:', modal.style.zIndex);
    console.log('🔍 Modal position:', modal.style.position);
    console.log('🔍 Modal in DOM:', document.body.contains(modal));
    console.log('🔍 Modal computed style:', window.getComputedStyle(modal));

    // Force modal to be visible
    modal.style.display = 'flex';
    modal.style.zIndex = '99999';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.8)';

    console.log('🔍 Modal after force styling:', {
      display: modal.style.display,
      zIndex: modal.style.zIndex,
      position: modal.style.position,
      backgroundColor: modal.style.backgroundColor
    });

    // Test if modal is actually visible
    setTimeout(() => {
      const modalInDOM = document.querySelector('[role="dialog"]');
      console.log('🔍 Modal found in DOM after 100ms:', modalInDOM);
      if (modalInDOM) {
        console.log('🔍 Modal computed styles:', window.getComputedStyle(modalInDOM));
        console.log('🔍 Modal offsetWidth/Height:', (modalInDOM as HTMLElement).offsetWidth, (modalInDOM as HTMLElement).offsetHeight);
        console.log('🔍 Modal getBoundingClientRect:', modalInDOM.getBoundingClientRect());
      } else {
        console.log('🔍 Modal NOT found in DOM - it was removed or never created');
      }
    }, 100);

    // Focus management for accessibility
    const closeBtn = modal.querySelector('#close-modal-btn') as HTMLButtonElement;
    const firstFocusableElement = closeBtn;

    // Trap focus within modal
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the close button initially
    setTimeout(() => firstElement?.focus(), 100);

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', handleKeyDown);
      } else if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.removeEventListener('keydown', handleKeyDown);
      }
    });

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    announcement.textContent = `Scripture passage opened: ${passage.reference}`;
    document.body.appendChild(announcement);

    // Remove announcement after a delay
    setTimeout(() => announcement.remove(), 1000);

        console.log('🔍 Accessible modal created with passage:', passage.reference);
  }

  testScriptureMapping() {
    console.log('🧪 Testing scripture mapping...');

    // Import the test function dynamically to avoid circular dependencies
    import('../utils/test-scripture-mapping').then(module => {
      const result = module.testScriptureMapping();

      if (result.success) {
        this.showSuccessMessage('Scripture mapping test completed successfully! Check console for details.');
        console.log('📊 Test results:', result);
      } else {
        this.showErrorMessage(`Scripture mapping test failed: ${result.error}`);
      }
    }).catch(error => {
      console.error('❌ Error importing test module:', error);
      this.showErrorMessage('Failed to load test module');
    });
  }

  downloadUpdatedDatabase() {
    console.log('📁 Downloading updated database...');

    import('../utils/test-scripture-mapping').then(module => {
      const result = module.downloadUpdatedDatabase();

      if (result.success) {
        this.showSuccessMessage('Database file download initiated! Check your downloads folder.');
        console.log('📁 Download result:', result);
      } else {
        this.showErrorMessage(`Database download failed: ${result.error}`);
      }
    }).catch(error => {
      console.error('❌ Error importing download module:', error);
      this.showErrorMessage('Failed to load download module');
    });
  }

  showUpdatedDatabaseContent() {
    console.log('📝 Showing updated database content...');

    import('../utils/test-scripture-mapping').then(module => {
      const result = module.showUpdatedDatabaseContent();

      if (result.success) {
        this.showSuccessMessage('Database content shown in console! Copy and replace the kriyah.ts file.');
        console.log('📝 Content result:', result);
      } else {
        this.showErrorMessage(`Failed to show database content: ${result.error}`);
      }
    }).catch(error => {
      console.error('❌ Error importing content module:', error);
      this.showErrorMessage('Failed to load content module');
    });
  }

  uploadToFirebase() {
    console.log('🔥 Uploading to Firebase...');

    import('../utils/test-scripture-mapping').then(async module => {
      try {
        const result = await module.uploadToFirebaseCollection(this.dataService);

        if (result.success) {
          this.showSuccessMessage(`Firebase upload successful! Uploaded ${result.uploadedCount} readings.`);
          console.log('🔥 Firebase upload result:', result);

          // Reload the readings after successful upload
          this.loadEnhancedReadings();
        } else {
          this.showErrorMessage(`Firebase upload failed: ${result.error}`);
        }
      } catch (error) {
        console.error('❌ Error in Firebase upload:', error);
        this.showErrorMessage('Firebase upload failed');
      }
    }).catch(error => {
      console.error('❌ Error importing Firebase module:', error);
      this.showErrorMessage('Failed to load Firebase module');
    });
  }

  testFixedFormat() {
    console.log('🧪 Testing fixed database format...');

    // Test the Pinchas readings with correct format
    const testReferences = [
      'NUM.25.10-NUM.25.18',
      'NUM.26.1-NUM.26.11',
      'NUM.26.12-NUM.26.34',
      'NUM.26.35-NUM.26.51',
      'NUM.26.52-NUM.26.65',
      'NUM.27.1-NUM.27.11',
      'NUM.27.12-NUM.27.23',
      '1KG.18.46-1KG.19.21' // Test haftarah
    ];

    testReferences.forEach((ref, index) => {
      console.log(`Day ${index + 1}: ${ref}`);
      this.bibleApiService.getPassage(ref).subscribe({
        next: (passage) => {
          console.log(`✅ Success for ${ref}:`, passage);
        },
        error: (error) => {
          console.log(`❌ Error for ${ref}:`, error);
        }
      });
    });
  }

  fixAllDatabaseFormats() {
    console.log('🔧 Starting comprehensive database format fix...');

    this.fixAllDatabaseFormatsService.uploadFixedDatabaseToFirebase()
      .then(() => {
        console.log('✅ Successfully fixed all database formats and uploaded to Firebase!');
        alert('Database formats fixed and uploaded to Firebase successfully!');
      })
      .catch((error) => {
        console.error('❌ Error fixing database formats:', error);
        alert('Error fixing database formats: ' + error.message);
      });
  }

  testWithSpecificDate() {
    console.log('🧪 Testing with specific date: 2025-07-25 (Pinchas Sabbath)');

    // Create a test date for July 25, 2025 (Pinchas Sabbath)
    const testDate = new Date('2025-07-25');
    const testDateStr = formatDate(testDate, 'yyyy-MM-dd', 'en');
    console.log('🔍 Test date formatted:', testDateStr);

    // Use the Sabbath readings method instead of the regular date method
    this.enhancedReadingsService.getEnhancedReadingsForDate(testDate).subscribe(res => {
      console.log('🧪 Test readings for specific date:', res);
      console.log('🧪 Test readings count:', res.length);

      res.forEach((reading, index) => {
        console.log(`🧪 Test Reading ${index}:`, {
          id: reading.id,
          idNo: reading.idNo,
          date: reading.date,
          isSabbath: reading.isSabbath,
          torah: reading.torah,
          prophets: reading.prophets,
          haftarah: reading.haftarah,
          haftarahReference: reading.haftarahReference
        });
      });

      if (res.length > 0) {
        this.readings = res;
        this.isSabbath = res.some(reading => reading.isSabbath);
        this.cd.detectChanges();
        console.log('✅ Test readings loaded successfully');
      } else {
        console.log('❌ No test readings found for date:', testDateStr);
      }
    });
  }


}
