import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaUsersComponent } from './beta-users.component';

describe('BetaUsersComponent', () => {
  let component: BetaUsersComponent;
  let fixture: ComponentFixture<BetaUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetaUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
