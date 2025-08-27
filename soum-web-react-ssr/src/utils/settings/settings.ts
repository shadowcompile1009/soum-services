import { SettingName } from "@declarations/settings/settings.enum";
import { Setting } from "@declarations/settings/settings.type";
import { fetchSettings } from "@libs/http/settings";
import { AppError } from "@util/app.error/app.error";
import { AppErrorType } from "@util/app.error/app.error.enum";
import { Either, left, right } from "@util/either";
import { ValueType } from "@util/value.type/value.type";

export const getSettingByNameFromFetchSettingsResponse = <T>(
  fetchSettingsResult: ValueType<ReturnType<typeof fetchSettings>>,
  settingName: SettingName
): Either<AppError, Setting<T>> => {
  if (fetchSettingsResult.isLeft()) {
    return left(fetchSettingsResult.value);
  }

  const setting = fetchSettingsResult.value.responseData.find(
    (setting) => setting.name === settingName
  );

  if (!setting) {
    return left(
      AppError.fromError(
        "Failed to get settings by name",
        "get-settings-by-name",
        AppErrorType.FIND_SETTINGS_BY_NAME,
        {
          settingName,
        }
      )
    );
  }

  return right(setting as Setting<T>);
};
