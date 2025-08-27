import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosReportComponent } from './promos-report.component';

describe('PromosReportComponent', () => {
  let component: PromosReportComponent;
  let fixture: ComponentFixture<PromosReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromosReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
