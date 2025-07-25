import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService, User } from '../services/data.service';
import { IonContent, IonAvatar, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Observable, of } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { addIcons } from 'ionicons';
import { person, mail, book, documentText, addCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonAvatar, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, BackButtonComponent]
})
export class PublicProfileComponent implements OnInit {
  user$: Observable<User | null> = of(null);

  constructor(private route: ActivatedRoute, private dataService: DataService, private sanitizer: DomSanitizer) {
    addIcons({person, mail, book, documentText, addCircleOutline});
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.user$ = this.dataService.getUserById(id);
    }
  }

  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getJoinedDate(createdAt?: string): string {
    if (!createdAt) {
      return 'Since 2024';
    }
    try {
      const date = new Date(createdAt);
      return `Since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } catch {
      return 'Since 2024';
    }
  }

  getBibleVersionName(version?: string): string {
    switch (version) {
      case 'ESV':
        return 'ESV (English Standard Version)';
      case 'KJV':
        return 'KJV (King James Version)';
      case 'HBSS':
        return 'Holy Bible in Simple Spanish';
      case 'RVR09':
        return 'RVR09 (Reina-Valera 1909, Spanish)';
      default:
        return 'ESV (Default)';
    }
  }
}
