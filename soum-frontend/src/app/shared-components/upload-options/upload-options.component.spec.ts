import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOptionsComponent } from './upload-options.component';

describe('UploadOptionsComponent', () => {
  let component: UploadOptionsComponent;
  let fixture: ComponentFixture<UploadOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadOptionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
