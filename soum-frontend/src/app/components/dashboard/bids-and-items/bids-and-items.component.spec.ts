import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsAndItemsComponent } from './bids-and-items.component';

describe('BidsAndItemsComponent', () => {
  let component: BidsAndItemsComponent;
  let fixture: ComponentFixture<BidsAndItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BidsAndItemsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsAndItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
