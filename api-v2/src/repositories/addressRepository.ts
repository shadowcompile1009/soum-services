import moment from 'moment';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { mappingMongoError } from '../libs/mongoError';
import { Address, LegacyUserAddressInput } from '../models/Address';
import { AddressDocument } from '../models/Address';
import { Constants } from '../constants/constant';

@Service()
export class AddressRepository {
  async getAddressById(id: string) {
    try {
      const address = (await Address.findById(id).exec()) as any;

      if (!address) {
        return [true, "Address id's not found"];
      }
      return [false, address];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async updateAddress(
    id: string,
    updatingAddress: LegacyUserAddressInput
  ): Promise<
    [boolean, { result: string | AddressDocument; message?: string }]
  > {
    try {
      const address = (await Address.findByIdAndUpdate(
        id,
        {
          street: updatingAddress.street,
          district: updatingAddress.district,
          city: updatingAddress.city,
          postal_code: updatingAddress.postal_code,
          longitude: updatingAddress.longitude,
          latitude: updatingAddress.latitude,
          is_default: updatingAddress.is_default,
          is_verified: updatingAddress.is_verified,
          updated_date: moment().toDate(),
          nationalAddress: updatingAddress.nationalAddress,
        },
        {
          upsert: true,
          new: true,
        }
      ).exec()) as AddressDocument;

      await address.save();

      return [false, { result: address, message: 'Update address successful' }];
    } catch (exception) {
      return [true, { result: null, message: exception.message }];
    }
  }
  async removeUserAddress(id: string): Promise<[boolean, any]> {
    try {
      await Address.findByIdAndDelete(id).exec();
      return [false, 'User address is removed successfully'];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async createAddress(
    userId: string,
    newAddress: LegacyUserAddressInput
  ): Promise<
    [
      boolean,
      { code: number; result: AddressDocument | string; message?: string }
    ]
  > {
    try {
      const address = new Address({
        street: newAddress.street,
        district: newAddress.district,
        city: newAddress.city,
        postal_code: newAddress.postal_code,
        longitude: newAddress.longitude,
        latitude: newAddress.latitude,
        is_default: newAddress.is_default,
        is_verified: newAddress.is_verified,
        user_id: mongoose.Types.ObjectId(userId),
        nationalAddress: newAddress.nationalAddress,
      });
      const data = await address.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Create new user address successful',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_ADD_ADDRESS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getUserAddress(
    userId: string
  ): Promise<
    [
      boolean,
      { code: number; result: AddressDocument[] | string; message?: string }
    ]
  > {
    try {
      const data = await Address.find({
        user_id: new mongoose.Types.ObjectId(userId),
      })
        .sort({ created_date: 1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Get user address successful',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ADDRESS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async checkSameExistingUserAddress(
    userId: string,
    newAddress: LegacyUserAddressInput
  ): Promise<AddressDocument> {
    return await Address.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      street: newAddress.street,
      district: newAddress.district,
      city: newAddress.city,
      postal_code: newAddress.postal_code,
      longitude: newAddress.longitude,
      latitude: newAddress.latitude,
      nationalAddress: newAddress.nationalAddress,
    }).exec();
  }
}
