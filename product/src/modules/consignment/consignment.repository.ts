import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Consignment } from './entity/consignment.entity';

@Injectable()
export class ConsignmentRepository extends EntityRepository<Consignment> {}
