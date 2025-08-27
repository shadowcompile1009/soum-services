import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteListingCommentPopupComponent } from './delete-listing-comment-popup.component';

describe('DeleteListingCommentPopupComponent', () => {
  let component: DeleteListingCommentPopupComponent;
  let fixture: ComponentFixture<DeleteListingCommentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteListingCommentPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteListingCommentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
