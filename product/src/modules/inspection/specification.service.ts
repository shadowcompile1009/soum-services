import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Specification, SpecificationReport, InspectionReport } from './entity/Specification';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(Specification)
    private readonly specificationRepo: EntityRepository<Specification>,
  ) {}

  async createSpecification(
    categoryId: string, 
    specificationReport: SpecificationReport[],
    inspectionReport: InspectionReport[] = []
  ) {
    const specification = new Specification();
    specification.categoryId = categoryId;
    specification.specificationReport = JSON.stringify(specificationReport);
    specification.inspectionReport = JSON.stringify(inspectionReport);

    await this.specificationRepo.persistAndFlush(specification);
    return specification;
  }

  async updateSpecification(
    categoryId: string, 
    specificationReport: SpecificationReport[],
    inspectionReport: InspectionReport[] = []
  ) {
    const specification = await this.specificationRepo.findOne({ categoryId });
    if (!specification) {
      throw new Error('Specification not found for this category');
    }

    specification.specificationReport = JSON.stringify(specificationReport);
    specification.inspectionReport = JSON.stringify(inspectionReport);
    await this.specificationRepo.persistAndFlush(specification);
    return specification;
  }

  async getSpecification(categoryId: string) {
    const specification = await this.specificationRepo.findOne({ categoryId });
    if (!specification) {
      return null;
    }

    return {
      ...specification,
      specificationReport: JSON.parse(specification.specificationReport || '[]'),
      inspectionReport: JSON.parse(specification.inspectionReport || '[]'),
    };
  }

  async deleteSpecification(categoryId: string) {
    const specification = await this.specificationRepo.findOne({ categoryId });
    if (!specification) {
      throw new Error('Specification not found for this category');
    }

    await this.specificationRepo.removeAndFlush(specification);
  }
} 
