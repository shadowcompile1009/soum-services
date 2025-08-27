import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBatteryComponent } from './set-battery.component';

describe('SetBatteryComponent', () => {
  let component: SetBatteryComponent;
  let fixture: ComponentFixture<SetBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetBatteryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
