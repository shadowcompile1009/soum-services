import { Injectable } from '@nestjs/common';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Cities } from './entities/cities.entity';
import { CreateCitiesDto } from './dto/cities.dto';

@Injectable()
export class CitiesService {
  @InjectRepository(Cities)
  private readonly citiesRepository: EntityRepository<Cities>;

  public async create(body: CreateCitiesDto): Promise<Cities> {
    return new Promise(async (resolve, reject) => {
      try {
        const cities: Cities = new Cities(
          body.name,
          body.arabicName,
          body.sellerTier,
          body.buyerTier,
        );
        await this.citiesRepository.persistAndFlush(cities);
        resolve(cities);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async find(): Promise<Cities[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const cities = await this.citiesRepository.findAll();
        resolve(cities);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findAndUpdate(body: CreateCitiesDto): Promise<Cities> {
    return new Promise(async (resolve, reject) => {
      try {
        const cities = await this.citiesRepository.findOne({
          name: body.name,
        });
        if (!cities) {
          return resolve(null);
        }
        const citiesToSave = wrap(cities).assign(
          {
            name: body.name,
            arabicName: body.arabicName,
            sellerTier: body.sellerTier,
            buyerTier: body.buyerTier,
          },
          { updateByPrimaryKey: false },
        );
        await this.citiesRepository.persistAndFlush(citiesToSave);
        resolve(cities);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOne(name: string): Promise<Cities> {
    return new Promise(async (resolve, reject) => {
      try {
        const city = await this.citiesRepository.findOne( { $or: [ { name }, {arabicName: name} ] } );
        city ? resolve(city) : reject(city);
      } catch(err) {
        reject(err);
      }
    });
  }

}
