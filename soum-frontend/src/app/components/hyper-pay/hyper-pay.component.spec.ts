import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHyperPayComponent } from './hyper-pay.component';

describe('TestHyperPayComponent', () => {
  let component: TestHyperPayComponent;
  let fixture: ComponentFixture<TestHyperPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHyperPayComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHyperPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
