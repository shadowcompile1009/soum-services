import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutEditComponent } from './payout-edit.component';

describe('PayoutEditComponent', () => {
  let component: PayoutEditComponent;
  let fixture: ComponentFixture<PayoutEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayoutEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayoutEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
