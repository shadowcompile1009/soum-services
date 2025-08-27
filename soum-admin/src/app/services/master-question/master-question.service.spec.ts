import { TestBed } from '@angular/core/testing';

import { MasterQuestionService } from './master-question.service';

describe('MasterQuestionService', () => {
  let service: MasterQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
