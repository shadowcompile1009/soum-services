import {
  EntityManager,
  EntityRepository,
  NotFoundError,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Option } from '../option/entities/option';
import { V2Service } from '../v2/v2.service';
import { CreateAttributeDto } from './dto/attribute.dto';
import { Attribute } from './entities/attribute';
import { AttributeStatus } from './enums/attribute-status.enum';
import {
  CreateAttributeRequest,
  GetAttributeRequest,
  GetAttributesRequest,
  GetMultipleAttributeRequest,
} from '../grpc/proto/category.pb';
import { AttributeDTO, UpdateAttributeDto } from './dto/attribute.dto';
import { OptionStatus } from '../option/enums/option-status.enum';
import { Option as IOption } from '../grpc/proto/category.pb';

@Injectable()
export class AttributeService {
  constructor(
    readonly v2Service: V2Service,
    private readonly em: EntityManager,
    @InjectRepository(Attribute)
    private readonly repo: EntityRepository<Attribute>,
    @InjectRepository(Option)
    private readonly optionRepo: EntityRepository<Option>,
  ) {}

  async getAttributes(
    req: GetAttributesRequest,
  ): Promise<{ attributes: Attribute[]; count: number }> {
    const pSize = req.size || 10;
    const pNumber = req.page || 1;
    const query = { status: AttributeStatus.ACTIVE };
    if (req.search) {
      const searchQuery = {
        $or: [
          { nameEn: { $ilike: `%${req.search}%` } },
          { nameAr: { $ilike: `%${req.search}%` } },
        ],
      };

      Object.assign(query, searchQuery);
    }

    const options = {
      limit: pSize,
      offset: (pNumber - 1) * pSize,
      orderBy: { createdAt: 'asc' },
    };
    if (req.optionsIncluded) {
      Object.assign(options, { populate: ['options'] });
    }

    const result = await this.repo.find(query, options);

    let count = 0;
    if (result) {
      count = await this.repo.count(query);
    }

    return { attributes: result, count: count };
  }

  async getAttributeById(req: GetAttributeRequest): Promise<Attribute> {
    const result = await this.em.findOne(
      Attribute,
      { id: req.id, status: AttributeStatus.ACTIVE },
      { populate: ['options'] as never[] }, // https://github.com/mikro-orm/mikro-orm/issues/2733
    );

    return result;
  }

  async getMultipleAttributes(
    req: GetMultipleAttributeRequest,
  ): Promise<Attribute[]> {
    const result = await this.em.find(
      Attribute,
      { id: { $in: req.ids }, status: AttributeStatus.ACTIVE },
      { populate: ['options'] as never[] }, // https://github.com/mikro-orm/mikro-orm/issues/2733
    );

    return result;
  }

  async createAttribute(req: CreateAttributeRequest): Promise<Attribute> {
    const newAttr = this.repo.create({
      nameEn: req.name,
      nameAr: req.nameAr,
    });

    await this.handleOptionCreate(newAttr, req.options);

    await this.em.persistAndFlush(newAttr);

    return newAttr;
  }

  private async handleOptionCreate(
    attribute: Attribute,
    optionsDto: IOption[],
  ) {
    const options = optionsDto.map((optionDTO) => {
      const option = new Option();
      option.assignDTOValues({
        nameEn: optionDTO.nameEn,
        nameAr: optionDTO.nameAr,
        status: (optionDTO.status || OptionStatus.ACTIVE) as OptionStatus,
        id: null,
        positionAr: optionDTO?.positionAr || 10000,
        positionEn: optionDTO?.positionEn || 10000,
      });

      return option;
    });

    return attribute.options.set(options);
  }

  async insertAttribute(req: CreateAttributeDto): Promise<Attribute> {
    const newAttr = this.repo.create({
      nameEn: req.nameEn,
      nameAr: req.nameAr,
    });

    await this.em.persistAndFlush(newAttr);

    return newAttr;
  }

  private async handleOptionUpdate(
    attribute: Attribute,
    dtoObject: AttributeDTO,
  ) {
    const currentOptions = await this.optionRepo.find({ attribute: attribute });
    const memo = new Set();
    const options = dtoObject.options.map((optionDTO) => {
      let option: Option;
      if (optionDTO.id) {
        memo.add(optionDTO.id);
        option = currentOptions?.find(
          (currentOption) => currentOption.id === optionDTO.id,
        );
      } else {
        option = new Option();
      }
      option?.assignDTOValues(optionDTO);

      return option;
    });

    const deletedOptions = currentOptions.filter((currentOption) => {
      if (currentOption.status === OptionStatus.DELETE) return true;
      if (!memo.has(currentOption.id)) {
        currentOption.status = OptionStatus.DELETE;
        return true;
      }
      return false;
    });
    attribute.options.set([...options, ...deletedOptions]);
  }

  async updateAttribute(dtoObject: UpdateAttributeDto): Promise<Attribute> {
    try {
      const attribute = await this.repo.findOneOrFail(dtoObject.id);
      attribute.assignDTOValues(dtoObject);
      await this.handleOptionUpdate(attribute, dtoObject);
      await this.em.persistAndFlush(attribute);

      return attribute;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(
          `Attribute with ID ${dtoObject.id} not found`,
        );
      } else {
        throw error;
      }
    }
  }

  async updateAttributeById(
    attributeId: string,
    payload: AttributeDTO,
  ): Promise<Attribute> {
    const updateAttributeDTO: UpdateAttributeDto = {
      id: attributeId,
      nameEn: payload.nameEn,
      nameAr: payload.nameAr,
      status: payload.status as AttributeStatus,
      options: payload.options,
    };
    return await this.updateAttribute(updateAttributeDTO);
  }

  async deleteAttribute(id: string): Promise<Attribute> {
    try {
      const attribute = await this.repo.findOneOrFail(id);
      attribute.status = AttributeStatus.DELETE;

      await this.em.flush();
      return attribute;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException(`Attribute with ID ${id} not found`);
      } else {
        throw error;
      }
    }
  }
}
