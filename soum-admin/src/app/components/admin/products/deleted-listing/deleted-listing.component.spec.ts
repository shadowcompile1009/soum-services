import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedListingComponent } from './deleted-listing.component';

describe('DeletedListingComponent', () => {
  let component: DeletedListingComponent;
  let fixture: ComponentFixture<DeletedListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
