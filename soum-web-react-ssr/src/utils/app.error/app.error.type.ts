export type AppErrorContext = {
  sourceError?: unknown;
  statusCode?: number;
  helpLink?: string;
} & Record<string, unknown>;
