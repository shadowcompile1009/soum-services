export const CommonExceptionFilterResponseError: (
  status: string,
  message: string,
  violations: any,
) => ICommonExceptionFilterResponseError = (
  status: string,
  message: string,
  violations: any,
): ICommonExceptionFilterResponseError => {
  return {
    status,
    message,
    timestamp: new Date().toISOString(),
    violations,
  };
};

export interface ICommonExceptionFilterResponseError {
  status: string;
  message: string;
  timestamp: string;
  violations: any;
}
