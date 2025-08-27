import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutRefundComponent } from './payout-refund.component';

describe('PayoutEditComponent', () => {
  let component: PayoutRefundComponent;
  let fixture: ComponentFixture<PayoutRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutRefundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
