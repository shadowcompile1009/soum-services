import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnholdListingComponent } from './onhold-listing.component';

describe('OnholdListingComponent', () => {
  let component: OnholdListingComponent;
  let fixture: ComponentFixture<OnholdListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnholdListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnholdListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
