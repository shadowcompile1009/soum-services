import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectMessageLoginComponent } from './redirect-message-login.component';

describe('RedirectMessageLoginComponent', () => {
  let component: RedirectMessageLoginComponent;
  let fixture: ComponentFixture<RedirectMessageLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectMessageLoginComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectMessageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
