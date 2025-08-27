import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { Rules } from './entities/rules.entity';
import { CreateRulesDto } from './dto/rules.dto';

@Injectable()
export class RulesService {
  @InjectRepository(Rules)
  private readonly rulesRepository: EntityRepository<Rules>;

  public async create(body: CreateRulesDto): Promise<Rules> {
    return new Promise(async (resolve, reject) => {
      try {
        const rule: Rules = new Rules(
          body.sellerTier,
          body.buyerTier,
          body.userType,
          body.vendor,
        );
        await this.rulesRepository.persistAndFlush(rule);
        resolve(rule);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOne(body: CreateRulesDto): Promise<Rules> {
    return new Promise(async (resolve, reject) => {
      try {
        const rule = await this.rulesRepository.findOne({
          userType: body.userType,
          sellerTier: body.sellerTier,
          buyerTier: body.buyerTier,
          vendor: body.vendor,
        });
        resolve(rule);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async find(): Promise<Rules[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rules = await this.rulesRepository.find(
          {
            vendor: { deletedAt: null },
            userType: { deletedAt: null },
          },
          {
            populate: ['vendor', 'userType'],
          },
        );
        resolve(rules);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findRule(sellerTier: number, buyerTier: number, userType: string): Promise<Rules[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const rule = await this.rulesRepository.find({
          sellerTier,
          buyerTier,
          userType
        });
        resolve(rule);
      } catch (err) {
        reject(err);
      }
    });
  } 
}
