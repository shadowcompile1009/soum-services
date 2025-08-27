import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPopupComponent } from './referral-popup.component';

describe('ReferralPopupComponent', () => {
  let component: ReferralPopupComponent;
  let fixture: ComponentFixture<ReferralPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferralPopupComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
