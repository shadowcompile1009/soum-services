import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlaggedListingComponent } from './flagged-listing.component';

describe('FlaggedListingComponent', () => {
  let component: FlaggedListingComponent;
  let fixture: ComponentFixture<FlaggedListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlaggedListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlaggedListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
