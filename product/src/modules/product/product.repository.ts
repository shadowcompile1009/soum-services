import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductRepository extends EntityRepository<Product> {}
