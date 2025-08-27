import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LockedUserComponent } from './locked-user.component';

describe('LockedUserComponent', () => {
  let component: LockedUserComponent;
  let fixture: ComponentFixture<LockedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LockedUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LockedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
