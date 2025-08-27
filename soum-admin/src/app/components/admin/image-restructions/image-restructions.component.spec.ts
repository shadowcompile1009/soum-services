import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRestructionsComponent } from './image-restructions.component';

describe('ImageRestructionsComponent', () => {
  let component: ImageRestructionsComponent;
  let fixture: ComponentFixture<ImageRestructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageRestructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageRestructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
