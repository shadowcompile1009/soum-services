import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'joi';

import { schemas } from '@src/modules/wallet-settings/validation';

@Injectable()
export class WalletSettingsValidationPipe implements PipeTransform<any> {
  async transform(value: any[]) {
    if (!Array.isArray(value)) {
      throw new BadRequestException(
        'Wallet settings config should be an array',
      );
    }

    for (let i = 0; i < value.length; i++) {
      const configName = value[i].name;
      const configDisplay = value[i].display;
      const configValue = value[i].value;
      const config = value[i];

      if (!configName || !configDisplay || !configValue) {
        throw new BadRequestException(
          "Wallet settings config should contain the fields 'name', 'display' and 'value'",
        );
      }

      const schema = schemas[configName];

      if (!schema) {
        throw new BadRequestException('Invalid config name provided');
      }

      const { error }: { error: ValidationError } = schema.validate(config);

      if (error) {
        const messages = [];
        error.details.forEach((detail) => messages.push(detail.message));
        throw new BadRequestException(messages);
      }
    }

    return value;
  }
}
