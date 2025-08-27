// Original file: node_modules/soum-proto/proto/addon.proto

import type {
  AddonItem as _addon_AddonItem,
  AddonItem__Output as _addon_AddonItem__Output,
} from '../addon/AddonItem';

export interface GetAddonsResponse {
  addons?: _addon_AddonItem[];
}

export interface GetAddonsResponse__Output {
  addons: _addon_AddonItem__Output[];
}
