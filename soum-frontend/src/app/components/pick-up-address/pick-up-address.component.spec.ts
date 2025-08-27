import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickUpAddressComponent } from './pick-up-address.component';

describe('PickUpAddressComponent', () => {
  let component: PickUpAddressComponent;
  let fixture: ComponentFixture<PickUpAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PickUpAddressComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickUpAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
