import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastStepListingComponent } from './last-step-listing.component';

describe('LastStepListingComponent', () => {
  let component: LastStepListingComponent;
  let fixture: ComponentFixture<LastStepListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastStepListingComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LastStepListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
