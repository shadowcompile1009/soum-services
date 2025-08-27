import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { CategoryCondition } from './entities/category-condition';

@Injectable()
export class CategoryConditionRepository extends EntityRepository<CategoryCondition> {}
