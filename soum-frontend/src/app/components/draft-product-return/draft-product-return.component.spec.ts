import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftProductReturnComponent } from './draft-product-return.component';

describe('DraftProductReturnComponent', () => {
  let component: DraftProductReturnComponent;
  let fixture: ComponentFixture<DraftProductReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DraftProductReturnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftProductReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
