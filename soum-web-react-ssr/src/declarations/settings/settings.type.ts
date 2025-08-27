import { SettingName } from "./settings.enum";

export type Setting<S extends unknown> = {
  id: string;
  name: SettingName;
  value: S;
};

export type FetchSettingsResponse = {
  responseData: Setting<unknown>[];
};
