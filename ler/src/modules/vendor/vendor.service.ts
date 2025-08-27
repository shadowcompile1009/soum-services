import { Injectable } from '@nestjs/common';
import { Vendor } from './entities/vendor.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateVendorDto } from './dto/vendor.dto';

@Injectable()
export class VendorService {
  @InjectRepository(Vendor)
  private readonly vendorRepository: EntityRepository<Vendor>;

  public async create(body: CreateVendorDto): Promise<Vendor> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendor: Vendor = new Vendor(
          body.name,
          body.arabicName,
          body.sellerTiers,
          body.buyerTiers,
          body.services,
        );
        await this.vendorRepository.persistAndFlush(vendor);
        resolve(vendor);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOne(name: string): Promise<Vendor> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendor = await this.vendorRepository.findOne({ name });
        vendor ? resolve(vendor) : resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findOneById(id: string): Promise<Vendor> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendor = await this.vendorRepository.findOne(id);
        vendor ? resolve(vendor) : resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async find(): Promise<Vendor[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendors = await this.vendorRepository.findAll();
        vendors ? resolve(vendors) : reject(vendors);
        resolve(vendors);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async findAndUpdate(body: CreateVendorDto): Promise<Vendor> {
    return new Promise(async (resolve, reject) => {
      try {
        const vendor = await this.vendorRepository.findOne({
          name: body.name,
        });
        if (!vendor) {
          return resolve(null);
        }
        const existServices = vendor.services?.split(',') || [];
        if (existServices.indexOf(body.services) === -1) {
          existServices.push(body.services);
        }
        const existSellerTiers = vendor.sellerTiers?.split(',') || [];
        if (existSellerTiers.indexOf(body.sellerTiers) === -1) {
          existSellerTiers.push(body.sellerTiers);
        }
        const existBuyerTiers = vendor.buyerTiers?.split(',') || [];
        if (existBuyerTiers.indexOf(body.buyerTiers) === -1) {
          existBuyerTiers.push(body.buyerTiers);
        }

        const vendorToSave = wrap(vendor).assign(
          {
            sellerTiers: existSellerTiers.toString(),
            buyerTiers: existBuyerTiers.toString(),
            services: existServices.toString(),
          },
          { updateByPrimaryKey: false },
        );
        await this.vendorRepository.persistAndFlush(vendorToSave);
        resolve(vendor);
      } catch (err) {
        reject(err);
      }
    });
  }
}
