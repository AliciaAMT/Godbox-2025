import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-landing',
  templateUrl: './footer-landing.component.html',
  styleUrls: ['./footer-landing.component.scss'],
  standalone: true,
  imports: [RouterLink]
})
export class FooterLandingComponent {
  public readonly currentYear = new Date().getFullYear();
}
