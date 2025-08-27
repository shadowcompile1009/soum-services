import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyInfoComponent } from './buy-info.component';

describe('BuyInfoComponent', () => {
  let component: BuyInfoComponent;
  let fixture: ComponentFixture<BuyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuyInfoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
