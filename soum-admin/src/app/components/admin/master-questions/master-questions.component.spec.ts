import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterQuestionsComponent } from './master-questions.component';

describe('MasterQuestionsComponent', () => {
  let component: MasterQuestionsComponent;
  let fixture: ComponentFixture<MasterQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterQuestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
