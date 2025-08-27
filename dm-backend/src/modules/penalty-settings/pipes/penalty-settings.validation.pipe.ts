import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'joi';

import { schemas } from '@src/modules/penalty-settings/validation';

@Injectable()
export class PenaltySettingsValidationPipe implements PipeTransform<any> {
  async transform(value: any) {
    const configName = value.name;
    const configDisplay = value.display;
    const config = value;

    if (!configName || !configDisplay) {
      throw new BadRequestException(
        "Penalty settings should contain the fields 'name', 'display'",
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

    return value;
  }
}
