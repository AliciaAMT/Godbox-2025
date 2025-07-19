import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  standalone: true,
  imports: [CommonModule, DatePipe]
})
export class DateComponent implements OnInit {
  monthname: any;
  d: any;
  month: any;
  days: string;
  hebDate = new Intl.DateTimeFormat('en-u-ca-hebrew',{year: 'numeric', month: 'long', day: 'numeric'}).format(new Date());

  constructor() {
    const d = new Date();
    this.month = Date.now();
    const days = [
      ' Yom Rishon - Discipleship',
      ' Yom Sh\'ní - Joyful Effort',
      ' Yom Sh\'lishí - Charity',
      ' Yom Rvi\'í - Skillfulness',
      ' Yom Ch\'mishí - Health',
      ' Yom Shishí - Fellowship',
      ' Shabbat - Holy'
    ];
    this.days = days[d.getDay()];
  }

  ngOnInit() {
    // const scriptUrl = 'https://www.hebcal.com/etc/hdate-en.js';
    // const node = document.createElement('script');
    // node.src = scriptUrl;
    // node.type = 'text/javascript';
    // node.async = true;
    // node.charset = 'utf-8';
    // document.getElementsByTagName('head')[0].appendChild(node);
  }
}
