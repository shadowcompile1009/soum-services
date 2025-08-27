import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveDraftModalComponent } from './save-draft-modal.component';

describe('SaveDraftModalComponent', () => {
  let component: SaveDraftModalComponent;
  let fixture: ComponentFixture<SaveDraftModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SaveDraftModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDraftModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
