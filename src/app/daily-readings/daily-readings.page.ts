import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { DataService, Readings } from '../services/data.service';
import { FooterLandingComponent } from '../components/footer-landing/footer-landing.component';
import { MenuHeaderComponent } from '../components/menu-header/menu-header.component';
import { DateComponent } from '../components/date/date.component';
import { KRIYAH } from '../database/kriyah';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-daily-readings',
  templateUrl: './daily-readings.page.html',
  styleUrls: ['./daily-readings.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonItem, IonLabel, CommonModule, FormsModule, RouterModule, FooterLandingComponent, MenuHeaderComponent, DateComponent]
})
export class DailyReadingsPage implements OnInit {
  dateS = new Date();
  today = formatDate(this.dateS, 'yyyy-MM-dd', 'en');
  readings: Readings[] = [];

  private dataService = inject(DataService);
  private cd = inject(ChangeDetectorRef);
  private firestore = inject(Firestore);

  constructor() {
    console.log('Today\'s date:', this.today);
    this.dataService.getReadingByThisDate().subscribe(res => {
      console.log('Readings found:', res);
      this.readings = res;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
  }

  async openGateway(id: string | undefined, kiriyah: string) {
    // TODO: Implement gateway functionality
    if (id) {
      console.log('Opening gateway for:', id, kiriyah);
    }
  }

  async uploadData() {
    const readingsCollection = collection(this.firestore, 'readings');

    for (const reading of Object.values(KRIYAH)) {
      addDoc(readingsCollection, reading);
      console.log('Uploading reading:', reading);
    }
  }

}
