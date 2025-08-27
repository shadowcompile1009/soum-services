import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { V2Service } from '../v2/v2.service';
import { LogisticServiceDto } from './dto/logistic-service.dto';
import { CreateServiceDto } from './dto/service.dto';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  @InjectRepository(Service)
  private readonly serviceRepository: EntityRepository<Service>;

  constructor(private readonly v2Service: V2Service) {}

  public async create(body: CreateServiceDto): Promise<Service> {
    return new Promise(async (resolve, reject) => {
      try {
        const service: Service = new Service(body.name, body.arabicName);
        await this.serviceRepository.persistAndFlush(service);
        resolve(service);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOne(value: string): Promise<Service> {
    return new Promise(async (resolve, reject) => {
      try {
        const service = await this.serviceRepository.findOne({
          $or: [{ id: value }, { name: value }],
        });
        resolve(service);
      } catch (err) {
        resolve(null);
      }
    });
  }

  public async find(): Promise<Service[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const services = await this.serviceRepository.findAll();
        services ? resolve(services) : reject(services);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async updateLogistic(
    logisticServiceDto: LogisticServiceDto,
  ): Promise<boolean> {
    const serviceObj = await this.findOne(logisticServiceDto.serviceId);
    if (!serviceObj) {
      throw new BadRequestException('Invalid service Id');
    }
    await this.v2Service.updateLogisticService({
      ...logisticServiceDto,
      serviceName: serviceObj.name,
    });
    return true;
  }
}
