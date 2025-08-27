import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelListingComponent } from './cancel-listing.component';

describe('CancelListingComponent', () => {
  let component: CancelListingComponent;
  let fixture: ComponentFixture<CancelListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelListingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
