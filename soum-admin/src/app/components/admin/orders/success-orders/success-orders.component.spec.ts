import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessOrdersComponent } from './success-orders.component';

describe('SuccessOrdersComponent', () => {
  let component: SuccessOrdersComponent;
  let fixture: ComponentFixture<SuccessOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
