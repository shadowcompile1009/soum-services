import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Condition } from './entities/condition';

@Injectable()
export class ConditionRepository extends EntityRepository<Condition> {}
