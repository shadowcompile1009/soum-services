import { useLocale } from "@hooks/useLocale";
import React, { JSX } from "react";
import { useClientSideProps } from "../../../../../../context/ClientSideProps";
import { fromEitherJSON } from "@utils/either";
import { ErrorView } from "@components/ErrorView/ErrorView";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { getCategoryLink, getPageLink } from "@utils/link/link";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";

const topCategoryNames = [
  "laptops",
  "mobiles",
  "headphone",
  "accessories",
  "camera",
  "iPads",
  "cars",
];

export const FooterTopCategory = (): JSX.Element => {
  const { isRTL, language } = useLocale();

  const { clientSideProps } = useClientSideProps();

  const result = clientSideProps?.categories
    ? fromEitherJSON(clientSideProps.categories)
    : undefined;

  if (!result || result.isLeft()) {
    return (
      <ErrorView
        errors={[
          result?.value ??
            AppError.fromError(
              "Failed to fetch categories",
              "fetch-categories-from-api",
              AppErrorType.API_ERROR
            ),
        ]}
      />
    );
  }

  const topCategories = result.value.responseData.filter((category) =>
    topCategoryNames.includes(category.category_name.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3 font-light text-sm mx-0 md:mx-auto">
      <span className="font-medium mb-1 text-base">Top Category</span>
      {topCategories.map((category, index) => {
        const name =
          language === "ar"
            ? category.category_name_ar
            : category.category_name;

        return (
          <a
            aria-label={name}
            lang={language}
            href={getCategoryLink(language, category)}
            key={index}
            className="font-medium text-neutral-400"
          >
            {name}
          </a>
        );
      })}
      <a
        lang={language}
        href={getPageLink(language, "/search")}
        className="flex gap-3"
      >
        <span className="font-medium">Browse All Product</span>
        <img
          src={getCloudImageUrl(
            isRTL ? "/arrow-left-icon.svg" : "/arrow-right-icon.svg"
          )}
          alt=""
          width={20}
          height={20}
          loading="lazy"
        />
      </a>
    </div>
  );
};
