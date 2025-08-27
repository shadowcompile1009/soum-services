import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulBidComponent } from './successful-bid.component';

describe('SuccessfulBidComponent', () => {
  let component: SuccessfulBidComponent;
  let fixture: ComponentFixture<SuccessfulBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessfulBidComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
