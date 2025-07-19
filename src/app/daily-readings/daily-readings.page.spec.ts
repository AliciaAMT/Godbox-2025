import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DailyReadingsPage } from './daily-readings.page';

describe('DailyReadingsPage', () => {
  let component: DailyReadingsPage;
  let fixture: ComponentFixture<DailyReadingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyReadingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
