import { CanActivate, Injectable, Logger, mixin } from '@nestjs/common';
import isEmpty from 'lodash/isEmpty';

import { memoize } from '@src/utils/memoize.util';
import { WalletSettingsService } from '@src/modules/wallet-settings/wallet-settings.service';

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export const WalletSettingsGuard: (name: string | string[]) => CanActivate =
  memoize(createSettingsGuard);

function createSettingsGuard(name: string | string[]): Type<CanActivate> {
  @Injectable()
  class WalletSettingsMixin implements CanActivate {
    constructor(private readonly walletSettingsService: WalletSettingsService) {
      if (!name || isEmpty(name)) {
        new Logger('WalletSettingsGuard').error('Please provide settings name');
      }
    }

    async canActivate(): Promise<boolean> {
      const settings = await this.walletSettingsService.findByNames(name);
      return settings.every((setting) => setting.value);
    }
  }

  const guard = mixin(WalletSettingsMixin);
  return guard;
}
