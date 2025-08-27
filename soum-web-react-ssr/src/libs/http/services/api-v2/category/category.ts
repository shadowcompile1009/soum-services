import { composeAPIUrl } from "@utils/http";
import { Either, left, right } from "@utils/either";
import { Service } from "@declarations/service/service.enum";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { FetchCategoriesResponse } from "@declarations/category/category.type";
import { httpClient } from "../../../http.client";

export const fetchCategories = async (): Promise<
  Either<AppError, FetchCategoriesResponse>
> => {
  try {
    const result: FetchCategoriesResponse = await httpClient
      .get<FetchCategoriesResponse>(composeAPIUrl(Service.V2, "category"))
      .then((result) => result.data);

    return right(result);
  } catch (error) {
    return left(
      AppError.fromError(
        "Failed to fetch categories",
        "fetch-categories-from-api",
        AppErrorType.API_ERROR,
        {
          sourceError: error,
        }
      )
    );
  }
};
