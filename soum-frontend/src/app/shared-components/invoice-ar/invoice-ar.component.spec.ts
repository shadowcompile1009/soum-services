import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceArComponent } from './invoice-ar.component';

describe('InvoiceArComponent', () => {
  let component: InvoiceArComponent;
  let fixture: ComponentFixture<InvoiceArComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceArComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceArComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
