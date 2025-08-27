import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceEnComponent } from './invoice-en.component';

describe('InvoiceEnComponent', () => {
  let component: InvoiceEnComponent;
  let fixture: ComponentFixture<InvoiceEnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvoiceEnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceEnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
