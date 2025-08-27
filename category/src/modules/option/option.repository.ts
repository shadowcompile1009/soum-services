import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Option } from './entities/option';

@Injectable()
export class AttributeRepository extends EntityRepository<Option> {}
