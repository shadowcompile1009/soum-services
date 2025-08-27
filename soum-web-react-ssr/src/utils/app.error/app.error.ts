import { AxiosError } from "axios";
import { AppErrorContext } from "./app.error.type";
import { AppErrorType } from "./app.error.enum";

export class AppError extends Error {
  private constructor(
    message: string,
    public translation: string,
    public type: AppErrorType,
    public context?: AppErrorContext
  ) {
    super(message);
  }

  static fromError(
    message: string,
    translation: string,
    type: AppErrorType,
    context?: AppErrorContext
  ): AppError {
    if (context?.sourceError instanceof AxiosError) {
      context.sourceError = {
        statusCode: context.sourceError.response?.status,
        message: context.sourceError.message,
        data:
          context.sourceError.config?.responseType === "arraybuffer"
            ? context.sourceError.response?.data?.toString("utf-8")
            : context.sourceError.response?.data ?? null,
        config: context.sourceError.config && {
          method: context.sourceError.config.method,
          url: context.sourceError.config.url,
          basUrl: context.sourceError.config.baseURL,
          data: context.sourceError.config.data,
          params: context.sourceError.config.params,
        },
      };
    }

    return new AppError(message, translation, type, context);
  }
}
