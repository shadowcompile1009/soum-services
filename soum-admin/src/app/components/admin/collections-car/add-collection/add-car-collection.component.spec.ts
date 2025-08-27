import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollectionCarComponent } from './add-car-collection.component';

describe('AddCollectionComponent', () => {
  let component: AddCollectionCarComponent;
  let fixture: ComponentFixture<AddCollectionCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCollectionCarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCollectionCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
