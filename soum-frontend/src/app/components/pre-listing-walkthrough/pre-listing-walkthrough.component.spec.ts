import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreListingWalkthroughComponent } from './pre-listing-walkthrough.component';

describe('PreListingWalkthroughComponent', () => {
  let component: PreListingWalkthroughComponent;
  let fixture: ComponentFixture<PreListingWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreListingWalkthroughComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreListingWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
