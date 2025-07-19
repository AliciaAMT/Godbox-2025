import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrowthBlogPage } from './growth-blog.page';

describe('GrowthBlogPage', () => {
  let component: GrowthBlogPage;
  let fixture: ComponentFixture<GrowthBlogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthBlogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
