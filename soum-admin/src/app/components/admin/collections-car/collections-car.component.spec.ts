import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionsCarComponent } from './collections-car.component';

describe('CollectionsCarComponent', () => {
  let component: CollectionsCarComponent;
  let fixture: ComponentFixture<CollectionsCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionsCarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
