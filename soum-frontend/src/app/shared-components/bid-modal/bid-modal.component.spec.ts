import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidModalComponent } from './bid-modal.component';

describe('BidModalComponent', () => {
  let component: BidModalComponent;
  let fixture: ComponentFixture<BidModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BidModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
