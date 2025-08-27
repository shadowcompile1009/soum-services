import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostListingWalkthroughComponent } from './post-listing-walkthrough.component';

describe('PostListingWalkthroughComponent', () => {
  let component: PostListingWalkthroughComponent;
  let fixture: ComponentFixture<PostListingWalkthroughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostListingWalkthroughComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListingWalkthroughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
