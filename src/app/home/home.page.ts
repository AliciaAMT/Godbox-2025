import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonIcon, IonButton, AlertController, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService, Post, User, Readings } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { ParashahService } from '../services/parashah.service';
import { debugHebCalEvents } from '../utils/debug-hebcal';
import { testGeneratedCode } from '../utils/test-generated-code';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonIcon,
    IonButton,
    FooterLandingComponent
  ],
})
export class HomePage implements OnInit {
  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);
  private parashahService = inject(ParashahService);

  posts: Post[] = [];
  users: User[] = [];

  constructor() {
    this.dataService.getPostsForCollection().subscribe({
      next: (data) => {
        this.posts = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      }
    });
    this.dataService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  ngOnInit() {}

  async openTestingMenu() {
    const alert = await this.alertController.create({
      header: 'Testing Tools',
      message: 'Choose an action:',
      buttons: [
        {
          text: 'Generate New Kriyah Database',
          handler: () => {
            this.generateNewKriyahDatabase();
          }
        },
        {
          text: 'Test Parashah Service',
          handler: () => {
            this.testParashahService();
          }
        },
        {
          text: 'Test Generated Code',
          handler: () => {
            this.testGeneratedCode();
          }
        },
        {
          text: 'Upload to Firebase',
          handler: () => {
            this.uploadToFirebase();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async generateNewKriyahDatabase() {
    const loading = await this.alertController.create({
      header: 'Generating Database',
      message: 'Please wait while we generate the new kriyah database...',
      buttons: []
    });

    await loading.present();

    try {
      // Generate readings for current year - use a wider range to ensure we get parashot
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear}-01-01`);
      const endDate = new Date(`${currentYear + 1}-01-01`); // Include next year's start to get all parashot

      const readings = this.parashahService.generateReadings(startDate, endDate);
      const tsCode = this.parashahService.generateDatabaseFile(readings);

      loading.dismiss();

      const successAlert = await this.alertController.create({
        header: 'Success!',
        message: `Generated ${readings.length} readings for ${currentYear}. The code has been copied to your clipboard. To update your database:

1. Open: src/app/database/kriyah.ts
2. Replace all content with the copied code
3. Save the file
4. Restart your development server`,
        buttons: [
          {
            text: 'Copy to Clipboard Again',
            handler: () => {
              navigator.clipboard.writeText(tsCode);
            }
          },
          {
            text: 'Download File',
            handler: () => {
              this.updateDatabaseFile(tsCode);
            }
          },
          {
            text: 'OK'
          }
        ]
      });

      await successAlert.present();

    } catch (error) {
      loading.dismiss();

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: `Failed to generate database: ${errorMessage}`,
        buttons: ['OK']
      });

      await errorAlert.present();
    }
  }

  async updateDatabaseFile(tsCode: string) {
    try {
      // Create a blob with the TypeScript code
      const blob = new Blob([tsCode], { type: 'text/plain' });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'kriyah.ts';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);

      const alert = await this.alertController.create({
        header: 'File Downloaded',
        message: 'The new kriyah.ts file has been downloaded. Please replace your existing database file with this new one.',
        buttons: ['OK']
      });

      await alert.present();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const alert = await this.alertController.create({
        header: 'Download Failed',
        message: `Error downloading file: ${errorMessage}`,
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  async uploadToFirebase() {
    const loading = await this.alertController.create({
      header: 'Uploading to Firebase',
      message: 'Please wait while we upload the readings to Firebase...',
      buttons: []
    });

    await loading.present();

    try {
      // Generate readings for current year
      const currentYear = new Date().getFullYear();
      const startDate = new Date(`${currentYear}-01-01`);
      const endDate = new Date(`${currentYear + 1}-01-01`);

      const readings = this.parashahService.generateReadings(startDate, endDate);
      const firebaseReadings = this.parashahService.convertToFirebaseReadings(readings);

      // Upload to Firebase
      await this.dataService.addReadings(firebaseReadings);

      loading.dismiss();

      const successAlert = await this.alertController.create({
        header: 'Success!',
        message: `Uploaded ${readings.length} readings to Firebase 'readings' collection for ${currentYear}. You can now test the daily readings page!`,
        buttons: [
          {
            text: 'Go to Daily Readings',
            handler: () => {
              // Navigate to daily readings page
              window.location.href = '/daily-readings';
            }
          },
          {
            text: 'OK'
          }
        ]
      });

      await successAlert.present();

    } catch (error) {
      loading.dismiss();

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorAlert = await this.alertController.create({
        header: 'Upload Failed',
        message: `Failed to upload to Firebase: ${errorMessage}`,
        buttons: ['OK']
      });

      await errorAlert.present();
    }
  }

  async testParashahService() {
    try {
      // Test with a smaller date range to see what events we get
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

                  const readings = this.parashahService.generateReadings(startDate, endDate);

      const alert = await this.alertController.create({
        header: 'Test Results',
        message: `Successfully generated ${readings.length} readings for January 2024. Sample: ${readings[0]?.parashat || 'None'}.`,
        buttons: ['OK']
      });

      await alert.present();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const alert = await this.alertController.create({
        header: 'Test Failed',
        message: `Error: ${errorMessage}`,
        buttons: ['OK']
      });

      await alert.present();
    }
  }

  async testGeneratedCode() {
    try {
      const isValid = testGeneratedCode();

      const alert = await this.alertController.create({
        header: 'Code Test Results',
        message: isValid ? '✅ Generated code is syntactically valid!' : '❌ Generated code has syntax errors. Check console for details.',
        buttons: ['OK']
      });

      await alert.present();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const alert = await this.alertController.create({
        header: 'Test Failed',
        message: `Error: ${errorMessage}`,
        buttons: ['OK']
      });

      await alert.present();
    }
  }
}
