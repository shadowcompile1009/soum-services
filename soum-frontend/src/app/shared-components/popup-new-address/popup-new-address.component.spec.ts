import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNewAddressComponent } from './popup-new-address.component';

describe('PopupNewAddressComponent', () => {
  let component: PopupNewAddressComponent;
  let fixture: ComponentFixture<PopupNewAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopupNewAddressComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupNewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
