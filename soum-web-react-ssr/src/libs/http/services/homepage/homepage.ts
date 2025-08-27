import { composeAPIUrl } from "@utils/http";
import { Either, left, right } from "@utils/either";
import { Service } from "@declarations/service/service.enum";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { httpClient } from "../../http.client";
import { FetchHomepageDataResponse } from "@declarations/homepage/homepage.type";

export const fetchHomePageData = async (): Promise<
  Either<AppError, FetchHomepageDataResponse>
> => {
  try {
    const result: FetchHomepageDataResponse = await httpClient
      .get<FetchHomepageDataResponse>(composeAPIUrl(Service.HOMEPAGE, "data"))
      .then((result) => result.data);

    return right(result);
  } catch (error) {
    return left(
      AppError.fromError(
        "Failed to fetch homepage data",
        "fetch-homepage-data-from-api",
        AppErrorType.API_ERROR,
        {
          sourceError: error,
        }
      )
    );
  }
};
