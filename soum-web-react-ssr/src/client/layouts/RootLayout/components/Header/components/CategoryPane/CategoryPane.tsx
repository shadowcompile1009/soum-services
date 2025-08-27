import { Nullable } from "@declarations/nullable/nullable.type";
import { CategoryCarousel } from "@components/CategoryCarousel/CategoryCarousel";
import { useClientSideProps } from "../../../../../../context/ClientSideProps";
import { fromEitherJSON } from "@utils/either";
import { JSX } from "react";
import React from "react";
import { ErrorView } from "@components/ErrorView/ErrorView";

export const CategoryPane = (): JSX.Element => {
  const { clientSideProps } = useClientSideProps();

  const result = clientSideProps?.categories
    ? fromEitherJSON(clientSideProps.categories)
    : undefined;

  if (!result) {
    return <ErrorView showUnexpectedError />;
  }

  if (result.isLeft()) {
    return <ErrorView errors={[result.value]} />;
  }

  return (
    <div className="w-full">
      <div className="max-w-screen-xl mx-auto">
        <CategoryCarousel categories={result.value.responseData} />
      </div>
    </div>
  );
};
