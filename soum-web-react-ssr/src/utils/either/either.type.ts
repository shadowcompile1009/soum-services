import { AppError } from "@utils/app.error/app.error";
import { left, Left } from "./either.left";
import { right, Right } from "./either.right";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { AppErrorContext } from "@utils/app.error/app.error.type";

export type Either<L, A> = Left<L, A> | Right<L, A>;

export type EitherJSON<V extends unknown> = {
  type: "right" | "left";
  value: V;
};

export const fromEitherJSON = <Right>({
  type,
  value,
}: EitherJSON<Right>): Either<AppError, Right> => {
  if (type == "right") {
    return right(value);
  }

  const {
    message,
    translation,
    type: errorType,
    context,
  } = value as {
    message: string;
    translation: string;
    type: AppErrorType;
    context?: AppErrorContext;
  };

  return left(AppError.fromError(message, translation, errorType, context));
};

export const toEitherJSON = <Right>(
  either: Either<AppError, Right>
): EitherJSON<Right> => {
  return {
    type: either.isLeft() ? "left" : "right",
    value: either.value as Right,
  };
};
