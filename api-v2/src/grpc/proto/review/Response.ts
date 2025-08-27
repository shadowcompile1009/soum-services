// Original file: node_modules/soum-proto/proto/review.proto

import type {
  Answer as _review_Answer,
  Answer__Output as _review_Answer__Output,
} from '../review/Answer';

export interface Response {
  questionId?: string;
  questionAr?: string;
  questionEn?: string;
  answers?: _review_Answer[];
}

export interface Response__Output {
  questionId: string;
  questionAr: string;
  questionEn: string;
  answers: _review_Answer__Output[];
}
