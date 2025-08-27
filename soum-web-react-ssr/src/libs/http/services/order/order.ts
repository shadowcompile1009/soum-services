import { composeAPIUrl } from "@utils/http";
import { Either, left, right } from "@utils/either";
import { Service } from "@declarations/service/service.enum";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { httpClient } from "../../http.client";
import { FetchRecentlySoldProductsResponse } from "@declarations/order/order.type";

export const fetchRecentlySoldProductsData = async (): Promise<
  Either<AppError, FetchRecentlySoldProductsResponse>
> => {
  try {
    const result: FetchRecentlySoldProductsResponse = await httpClient
      .get<FetchRecentlySoldProductsResponse>(
        composeAPIUrl(Service.ORDER, "recently-sold/products")
      )
      .then((result) => result.data);

    return right(result);
  } catch (error) {
    return left(
      AppError.fromError(
        "Failed to fetch recently sold products data",
        "fetch-recently-sold-products-from-api",
        AppErrorType.API_ERROR,
        {
          sourceError: error,
        }
      )
    );
  }
};
