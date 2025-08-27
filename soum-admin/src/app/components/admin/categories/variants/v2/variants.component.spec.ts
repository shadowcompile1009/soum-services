import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantsV2Component } from './variants.component';

describe('VariantsComponent', () => {
  let component: VariantsV2Component;
  let fixture: ComponentFixture<VariantsV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VariantsV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantsV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
