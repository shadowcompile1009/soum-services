import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Category } from './entities/category';

@Injectable()
export class CategoryRepository extends EntityRepository<Category> {}
