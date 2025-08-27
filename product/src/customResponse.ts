export class CustomResponse<T> {
  status: string;
  message: string;
  data: T;
  code: number; // this is just for mobile cuz they have a lot of code depened on it
}

export enum CustomResponseStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
}
