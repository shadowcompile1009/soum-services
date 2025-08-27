import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Attribute } from '../attribute/entities/attribute';
import { AttributeStatus } from '../attribute/enums/attribute-status.enum';
import {
  CreateOptionDto,
  DeleteOptionDto,
  GetOptionDto,
  GetOptionsDto,
  UpdateOptionDto,
} from './dto/option.dto';
import { Option } from './entities/option';
import { OptionStatus } from './enums/option-status.enum';
import { SortableObject, sortArrayByValue } from './dto/sorting';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(Option)
    private readonly repo: EntityRepository<Option>,
    @InjectRepository(Attribute)
    private readonly attr: EntityRepository<Attribute>,
    private readonly em: EntityManager,
  ) {}

  async getOptions(
    req: GetOptionsDto,
  ): Promise<{ options: Option[]; count: number }> {
    const pSize = req.size || 10;
    const pNumber = req.page || 1;
    const query = {
      status: OptionStatus.ACTIVE,
      attribute: req.attributeId,
    };
    if (req.search) {
      const searchQuery = {
        $or: [
          { nameEn: { $ilike: `%${req.search}%` } },
          { nameAr: { $ilike: `%${req.search}%` } },
        ],
      };

      Object.assign(query, searchQuery);
    }
    const result = await this.repo.find(query, {
      limit: pSize,
      offset: (pNumber - 1) * pSize,
      orderBy: { created_at: 'asc' },
    });

    let count = 0;
    if (result) {
      count = await this.repo.count(query);
    }

    return { options: result, count: count };
  }

  async getOptionById(req: GetOptionDto): Promise<Option> {
    const result = await this.em.findOne(
      Option,
      { id: req.optionId, status: OptionStatus.ACTIVE },
      { populate: ['attribute'] as never[] }, // https://github.com/mikro-orm/mikro-orm/issues/2733
    );

    return result;
  }

  async createOption(req: CreateOptionDto): Promise<Option> {
    const attribute = await this.em.findOneOrFail(Attribute, {
      id: req.attributeId,
      status: AttributeStatus.ACTIVE,
    });
    const newOption = this.repo.create({
      nameEn: req.nameEn,
      nameAr: req.nameAr,
      status: (req.status as any) || OptionStatus.ACTIVE,
      attribute: attribute,
      positionAr: req?.positionAr || 10000,
      positionEn: req?.positionEn || 10000,
    });

    this.em.persist(newOption);
    await this.em.flush();

    return newOption;
  }

  async deleteOption(req: DeleteOptionDto): Promise<Option> {
    const deletingOption = await this.repo.findOne({
      id: req.optionId,
      status: OptionStatus.ACTIVE,
    });
    deletingOption.status = OptionStatus.DELETE;
    this.em.persist(deletingOption);
    await this.em.flush();

    return deletingOption;
  }

  async updateOption(optionId: any, req: UpdateOptionDto): Promise<Option> {
    const updatingOption = await this.repo.findOne({
      id: optionId.optionId,
      status: OptionStatus.ACTIVE,
    });
    const attribute = await this.em.findOne(Attribute, {
      id: req.attributeId,
      status: AttributeStatus.ACTIVE,
    });
    if (!attribute) {
      throw new NotFoundException('Attribute ID unavailable');
    }
    if (req?.positionAr) {
      updatingOption.positionAr = req.positionAr;
    }
    if (req?.positionEn) {
      updatingOption.positionEn = req.positionEn;
    }
    updatingOption.nameEn = req.nameEn;
    updatingOption.nameAr = req.nameAr;
    updatingOption.attribute = attribute;

    this.em.persist(updatingOption);
    await this.em.flush();

    return updatingOption;
  }

  async updateOptionPosition(): Promise<string> {
    try {
      const attributes = await this.attr.find(
        { scanned: false },
        { limit: 1, populate: ['options'] },
      );

      for (const attribute of attributes) {
        if (attribute.options.length > 0) {
          const mapOptsAr = attribute.options.map((opt: Option) => {
            return {
              value: opt.nameAr,
              position: opt.positionAr,
              optionId: opt.id,
            } as SortableObject;
          });

          const mapOptsEn = attribute.options.map((opt: Option) => {
            return {
              value: opt.nameEn,
              position: opt.positionEn,
              optionId: opt.id,
            } as SortableObject;
          });

          const sortedAr = sortArrayByValue(mapOptsAr);
          const sortedEn = sortArrayByValue(mapOptsEn);

          sortedAr.forEach((opt, index) => {
            const option = attribute.options.find((o) => o.id === opt.optionId);
            if (option) {
              option.positionAr = index + 1;
              option.scanned = true;
            }
          });

          sortedEn.forEach((opt, index) => {
            const option = attribute.options.find((o) => o.id === opt.optionId);
            if (option) {
              option.positionEn = index + 1;
              option.scanned = true;
            }
          });
        }
        attribute.scanned = true;
        this.em.assign(attribute, { scanned: true });
      }
      await this.em.flush();
      return 'update successful';
    } catch (err) {
      return err.message;
    }
  }
}
