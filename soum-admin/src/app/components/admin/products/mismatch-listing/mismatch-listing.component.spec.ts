import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MismatchListingComponent } from './mismatch-listing.component';

describe('MismatchListingComponent', () => {
  let component: MismatchListingComponent;
  let fixture: ComponentFixture<MismatchListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MismatchListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MismatchListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
