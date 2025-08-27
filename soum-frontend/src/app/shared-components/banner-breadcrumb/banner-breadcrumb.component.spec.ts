import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerBreadcrumbComponent } from './banner-breadcrumb.component';

describe('BannerBreadcrumbComponent', () => {
  let component: BannerBreadcrumbComponent;
  let fixture: ComponentFixture<BannerBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BannerBreadcrumbComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
