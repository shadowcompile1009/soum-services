import { SettingDocument } from '../models/Setting';

export type VersionValidationDto = {
  clientType: string;
  version: string;
};
export async function validateVersion(
  versionValidationDto: VersionValidationDto,
  settings: SettingDocument[]
) {
  const mobile_validate_version =
    (settings as SettingDocument[]).find(
      elem => elem.name == 'mobile_validate_version'
    )?.value || false;
  const mobile_ios_expected_versions =
    (settings as SettingDocument[]).find(
      elem => elem.name == 'mobile_ios_expected_versions'
    )?.value || '';
  const mobile_android_expected_versions =
    (settings as SettingDocument[]).find(
      elem => elem.name == 'mobile_android_expected_versions'
    )?.value || '';
  if ((settings as SettingDocument[]) && mobile_validate_version) {
    if (
      versionValidationDto.clientType == 'mobile-ios' &&
      !mobile_ios_expected_versions
        .split('/')
        .includes(versionValidationDto.version)
    ) {
      return false;
    } else if (
      versionValidationDto.clientType == 'mobile-android' &&
      !mobile_android_expected_versions
        .split('/')
        .includes(versionValidationDto.version)
    ) {
      return false;
    }
  }
  return true;
}
