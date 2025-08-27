// Original file: node_modules/soum-proto/proto/search.proto

export const OperationMode = {
  MODE_UNSPECIFIED: 'MODE_UNSPECIFIED',
  OPERATION_MODE_1: 'OPERATION_MODE_1',
  OPERATION_MODE_2: 'OPERATION_MODE_2',
} as const;

export type OperationMode =
  | 'MODE_UNSPECIFIED'
  | 0
  | 'OPERATION_MODE_1'
  | 1
  | 'OPERATION_MODE_2'
  | 2;

export type OperationMode__Output =
  typeof OperationMode[keyof typeof OperationMode];
