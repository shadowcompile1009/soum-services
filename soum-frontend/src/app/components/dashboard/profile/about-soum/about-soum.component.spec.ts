import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSoumComponent } from './about-soum.component';

describe('AboutSoumComponent', () => {
  let component: AboutSoumComponent;
  let fixture: ComponentFixture<AboutSoumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSoumComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSoumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
