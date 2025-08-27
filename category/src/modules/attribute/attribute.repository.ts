import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Attribute } from './entities/attribute';

@Injectable()
export class AttributeRepository extends EntityRepository<Attribute> {}
