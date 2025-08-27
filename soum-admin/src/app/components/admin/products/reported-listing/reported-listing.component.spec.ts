import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedListingComponent } from './reported-listing.component';

describe('ReportedListingComponent', () => {
  let component: ReportedListingComponent;
  let fixture: ComponentFixture<ReportedListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportedListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
