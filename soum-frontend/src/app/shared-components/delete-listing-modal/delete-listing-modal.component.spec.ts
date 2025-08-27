import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListingModalComponent } from './delete-listing-modal.component';

describe('DeleteListingModalComponent', () => {
  let component: DeleteListingModalComponent;
  let fixture: ComponentFixture<DeleteListingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteListingModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteListingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
