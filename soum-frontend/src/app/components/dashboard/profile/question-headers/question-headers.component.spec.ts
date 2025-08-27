import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionHeadersComponent } from './question-headers.component';

describe('QuestionHeadersComponent', () => {
  let component: QuestionHeadersComponent;
  let fixture: ComponentFixture<QuestionHeadersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionHeadersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
