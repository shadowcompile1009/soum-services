import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutOrderComponent } from './payout-order.component';

describe('PayoutOrderComponent', () => {
  let component: PayoutOrderComponent;
  let fixture: ComponentFixture<PayoutOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
