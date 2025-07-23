import { Component, OnInit } from '@angular/core';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { DataService, Post, User } from '../../../../services/data.service';
import { BackButtonComponent } from '../../../back-button/back-button.component';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonContent,

    IonSpinner,
    BackButtonComponent
  ]
})
export class ViewPostComponent implements OnInit {
  post: Post | null = null;
  users: User[] = [];
  id: string | null = null;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.dataService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.dataService.getPostById(this.id).subscribe(res => {
        this.post = res;
      });
    }
  }

  goBack() {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      this.location.back();
    } else {
      // Default to growth blog if no previous page
      this.router.navigate(['/growth-blog']);
    }
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user?.userName || 'Unknown User';
  }
}
