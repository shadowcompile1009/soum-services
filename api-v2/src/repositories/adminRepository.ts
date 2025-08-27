import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { BaseRepository } from './BaseRepository';
import { Admin, AdminDocument } from '../models/Admin';

@Service()
export class AdminRepository extends BaseRepository {
  async getById(
    userId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      if (!userId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const data = await Admin.findById(userId).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.USER_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }

  async findOrCreateNew(
    email?: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data: AdminDocument = await Admin.findOneAndUpdate(
        { email: email },
        {
          resetToken: '',
          emailOtp: '',
          status: 'Active',
          name: 'Martin',
          email: 'm.duong@soum.sa',
          password:
            '$2a$10$j2YlPKWKFfl4iD0njbkBJeBgqvU.NhJEbKzz6XEBGC6UqppGAk7Ou',
          role: 'superadmin',
          phoneNumber: '1094526832',
          profilePic:
            'https://soum01.fra1.digitaloceanspaces.com/soum-prod/profileImages/preview-img-1633581857792.png',
          token: '',
        },
        { new: true }
      ).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.USER_NOT_FOUND,
          message: exception.message,
        },
      ];
    }
  }
}
