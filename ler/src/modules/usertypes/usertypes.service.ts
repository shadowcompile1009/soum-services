import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { UserType } from './entities/userType.entity';
import { CreateUserTypeDto } from './dto/usertype.dto';

@Injectable()
export class UserTypesService {
  @InjectRepository(UserType)
  private readonly userTypeRepository: EntityRepository<UserType>;

  public async create(body: CreateUserTypeDto): Promise<UserType> {
    return new Promise(async (resolve, reject) => {
      try {
        const userType: UserType = new UserType(body.name, null);
        await this.userTypeRepository.persistAndFlush(userType);
        resolve(userType);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOne(name: string): Promise<UserType> {
    return new Promise(async (resolve, reject) => {
      try {
        const userType = await this.userTypeRepository.findOne({ name });
        resolve(userType);
      } catch (err) {
        resolve(null);
      }
    });
  }

  public async find(): Promise<UserType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const userTypes = await this.userTypeRepository.findAll();
        userTypes ? resolve(userTypes) : reject(userTypes);
      } catch (err) {
        reject(err);
      }
    });
  }
}
