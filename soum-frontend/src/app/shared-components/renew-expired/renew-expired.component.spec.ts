import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewExpiredComponent } from './renew-expired.component';

describe('RenewExpiredComponent', () => {
  let component: RenewExpiredComponent;
  let fixture: ComponentFixture<RenewExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RenewExpiredComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
