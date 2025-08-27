import { composeAPIUrl } from "@utils/http";
import { Either, left, right } from "@utils/either";
import { Service } from "@declarations/service/service.enum";
import { AppError } from "@utils/app.error/app.error";
import { AppErrorType } from "@utils/app.error/app.error.enum";
import { FetchSettingsResponse } from "@declarations/settings/settings.type";
import { httpClient } from "../../../http.client";

export const fetchSettings = async (): Promise<
  Either<AppError, FetchSettingsResponse>
> => {
  try {
    const result = await httpClient
      .get<FetchSettingsResponse>(composeAPIUrl(Service.V2, "setting"))
      .then((result) => result.data);

    return right(result);
  } catch (error) {
    return left(
      AppError.fromError(
        "Failed to fetch settings",
        "fetch-settings-from-api",
        AppErrorType.API_ERROR,
        {
          sourceError: error,
        }
      )
    );
  }
};
