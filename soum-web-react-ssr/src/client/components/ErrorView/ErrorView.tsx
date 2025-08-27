import { Alert } from "@components/Alert/Alert";
import { AppError } from "@utils/app.error/app.error";
import { Either } from "@utils/either";
import { Left } from "@utils/either/either.left";
import React from "react";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

export type ErrorViewProps = {
  children?: React.ReactNode;
  errors?: Array<Either<AppError, unknown> | AppError>;
  showComponentOnError?: boolean;
  showUnexpectedError?: boolean;
};

export const ErrorView = ({
  errors,
  children,
  showComponentOnError,
}: ErrorViewProps): JSX.Element => {
  const { t } = useTranslation("ErrorsMessages");

  const errorMessages = (
    errors?.map((error) => {
      if (error instanceof AppError) {
        return error.translation;
      } else {
        return (error as Left<AppError, unknown>).value.translation;
      }
    }) ?? []
  ).filter(Boolean);

  const showComponent = !!errorMessages.length
    ? showComponentOnError ?? false
    : true;

  return (
    <div className="flex flex-col gap-3">
      {!!errorMessages?.length && (
        <Alert>{errorMessages.map((errorMessage) => t(errorMessage))}</Alert>
      )}
      {showComponent ? children : null}
    </div>
  );
};
function useTranslations(arg0: string) {
  throw new Error("Function not implemented.");
}
