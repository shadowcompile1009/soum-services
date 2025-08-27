import { PartialType } from '@nestjs/swagger';

import { BaseTransactionDto } from '@modules/transaction/dto/base-transaction.dto';
export class UpdateTransactionDto extends PartialType(BaseTransactionDto) {}
