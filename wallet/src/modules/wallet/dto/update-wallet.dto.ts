import { PartialType } from '@nestjs/swagger';

import { BaseWalletDto } from '@modules/wallet/dto/base-wallet.dto';

export class UpdateWalletDto extends PartialType(BaseWalletDto) {
  updatedAt: Date;
}
