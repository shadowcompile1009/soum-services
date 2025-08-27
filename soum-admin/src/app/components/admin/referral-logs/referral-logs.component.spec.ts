import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralLogsComponent } from './referral-logs.component';

describe('ReferralLogsComponent', () => {
  let component: ReferralLogsComponent;
  let fixture: ComponentFixture<ReferralLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
