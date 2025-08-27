import { composeAPIUrl } from "@utils/http";
import { Either, left, right } from "@utils/either";
import { Service } from "@declarations/service/service.enum";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { FetchBrandsResponse } from "@declarations/brand/brand.type";
import { httpClient } from "../../../http.client";

export const fetchBrands = async (): Promise<
  Either<AppError, FetchBrandsResponse>
> => {
  try {
    const result: FetchBrandsResponse = await httpClient
      .get<FetchBrandsResponse>(composeAPIUrl(Service.V2, "brand/brands"))
      .then((result) => result.data);

    return right(result);
  } catch (error) {
    return left(
      AppError.fromError(
        "Failed to fetch brands",
        "fetch-brands-from-api",
        AppErrorType.API_ERROR,
        {
          sourceError: error,
        }
      )
    );
  }
};
