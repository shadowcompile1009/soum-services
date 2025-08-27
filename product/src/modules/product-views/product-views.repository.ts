import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { ProductView } from './entities/product-views.entity';

@Injectable()
export class ProductViewRepository extends EntityRepository<ProductView> {}
