import { NextPageContext, Redirect } from 'next';
import { parseCookies } from 'nookies';
import { instanceToPlain } from 'class-transformer';

import { apiClient, apiClientV2, apiGatewayClient } from '@src/api/client';
import {
  SignInDTO,
  AddNewUserDTO,
  VerifyTotpDTO,
  EditUserDTO,
} from '@src/types/dto';

const DEFAULT_REDIRECT: Redirect = {
  destination: '/orders',
  permanent: false,
};

const DEFAULT_PROPS: Record<string, unknown> = {};

export const UserEndpoints = {
  login: 'login',
  logout: 'logout',
  verifyTotp: 'verify-totp',
  verifyEnableMultiAuth: 'verify-enable-mfa-auth',
  verifyEnableMultiAuthAdmin: 'rest/api/v1/dm-auth/mfa/enable/auth',
  adminverifyTotp: 'rest/api/v1/dm-auth/mfa/auth',
  adminLogin: 'rest/api/v1/dm-auth/login',
  adminLogout: 'admin/logout',
  users(limit: string, page?: string, searchValue?: string) {
    return `rest/api/v1/user?&page=${
      page ? page : '1'
    }&limit=${limit}&mobileNumber=${searchValue ? searchValue : ''}&`;
  },
  roles() {
    return `authz/roles`;
  },
  addUser: 'rest/api/v1/dm-users',
  getUserDetails(userId: string) {
    return `/authz/users/adm/${userId}`;
  },
  getUserRoles: 'rest/api/v1/dm-users/roles',
  editUser(userId: string) {
    return `rest/api/v1/dm-users/${userId}/role`;
  },
  deleteUser(userId: string) {
    return `rest/api/v1/dm-users/${userId}`;
  },
  changeStatus(userId: string) {
    return `/rest/api/v1/user/change-status/${userId}`;
  },
  searchUser(limit: string, offset: string, searchValue?: string) {
    return `/rest/api/v1/user?page=1&limit=${limit}&offset=${offset}${
      searchValue ? `&mobileNumber=${searchValue}` : ''
    }`;
  },
};

export interface IUserResponse {
  index: number;
  user_id: string;
  name: string;
  status: string;
  countryCode: string;
  mobileNumber: string;
  lastLoginDate: string;
  updatedDate: string;
}
export interface IUser {
  index: number;
  id: string;
  name: string;
  status: string;
  countryCode: string;
  mobileNumber: string;
  lastLoginDate: string;
  updatedDate: string;
}
export interface IRolesResponse {
  id: string;
  name: string;
  displayName: string;
  canAccessAll: boolean;
  group: IRoleGroup;
}
export interface IRole {
  roleId: string;
  groupId: string;
  displayName: string;
}
export interface IRoleGroup {
  id: string;
  name: string;
  displayName: string;
}
export class UserApp {
  static async getUsers({
    limit,
    searchValue,
    page,
  }: {
    limit: string;
    searchValue: string;
    page: string;
  }) {
    let result;

    if (searchValue) {
      result = await apiClientV2.client.get(
        UserEndpoints.users(limit, page, searchValue)
      );
    } else {
      result = await apiClientV2.client.get(UserEndpoints.users(limit, page));
    }

    return { ...result.data.responseData, page };
  }

  static async getUserDetails(userId: string) {
    const result = await apiGatewayClient.client.get(
      UserEndpoints.getUserDetails(userId)
    );

    return result.data;
  }

  static async getRoles() {
    const result = await apiGatewayClient.client.get(UserEndpoints.roles());
    return result.data;
  }

  static mapRoles(roles: IRolesResponse[]): IRole[] {
    return roles?.map((role) => ({
      roleId: role.id,
      groupId: role?.group?.id,
      displayName: role?.displayName,
    }));
  }

  static mapUsers(users: IUserResponse[], page: string): UserApp[] {
    const mappedUsers = users?.map((user: IUserResponse, index: number) => {
      const baseIndex = (Number(page) - 1) * 20;

      return new UserApp({
        index: index + baseIndex + 1,
        id: user?.user_id,
        name: user?.name,
        status: user?.status,
        countryCode: user?.countryCode,
        mobileNumber: user?.mobileNumber,
        lastLoginDate: user?.lastLoginDate,
        updatedDate: user?.updatedDate,
      });
    });

    return instanceToPlain(mappedUsers) as UserApp[];
  }

  static async addUser(formValues: AddNewUserDTO) {
    const result = await apiClientV2.client.post(UserEndpoints.addUser, {
      username: formValues.name,
      email: formValues.email,
      password: formValues.password,
      phoneNumber: formValues.phoneNumber,
      roleId: formValues.role?.roleId,
      groupId: formValues.role?.groupId,
    });
    return result.data;
  }

  static async editUser(formValues: EditUserDTO) {
    const result = await apiClientV2.client.put(
      UserEndpoints.editUser(formValues.id),
      {
        roleId: formValues.roleId,
      }
    );
    return result.data;
  }

  static async deleteUser(userId: string) {
    const result = await apiClientV2.client.delete(
      UserEndpoints.deleteUser(userId)
    );
    return result.data;
  }

  static async changeStatus(userId: string, status: string) {
    const result = await apiClientV2.client.put(
      UserEndpoints.changeStatus(userId),
      { status }
    );
    return result.data;
  }

  static getUserToken(ctx?: NextPageContext) {
    // if no ctx means we are running on the client
    if (!ctx) {
      const cookies = parseCookies();
      const token = cookies['x-auth-token'];
      return token;
    }

    const cookies = parseCookies(ctx);
    const token = cookies['x-auth-token'];
    return token;
  }

  static async logout() {
    const res = await apiClient.post(UserEndpoints.logout);
    return res;
  }

  static async login(values: SignInDTO) {
    const result = await apiClient.post(UserEndpoints.login, values);
    return result;
  }

  static async verifyTotp(values: VerifyTotpDTO) {
    const result = await apiClient.post(UserEndpoints.verifyTotp, values);
    return result;
  }

  static async verifyEnableMultiAuth(values: VerifyTotpDTO) {
    const result = await apiClient.post(
      UserEndpoints.verifyEnableMultiAuth,
      values
    );
    return result;
  }

  static async checkIfLoggedIn(
    ctx: NextPageContext,
    redirect: Redirect = DEFAULT_REDIRECT,
    props: Record<string, unknown> = DEFAULT_PROPS
  ) {
    try {
      const cookies = parseCookies(ctx);
      const token = cookies['x-auth-token'];
      if (!token) {
        return {
          props,
        };
      }

      return {
        redirect,
      };
    } catch (err) {
      return {
        props,
      };
    }
  }

  static async checkIfNotLoggedIn(
    ctx: NextPageContext,
    redirect: Redirect,
    props: Record<string, unknown> = DEFAULT_PROPS
  ) {
    try {
      const cookies = parseCookies(ctx);
      const token = cookies['x-auth-token'];
      if (!token) {
        return {
          redirect,
        };
      }

      return {
        ...props,
      };
    } catch (err) {
      return {
        redirect,
      };
    }
  }

  public id: string;
  public index: number;
  public name: string;
  public status: string;
  public phoneNumber: string;
  public lastLoginDate: string;
  public updatedDate: string;

  constructor({
    index,
    id,
    name,
    status,
    countryCode,
    mobileNumber,
    lastLoginDate,
    updatedDate,
  }: IUser) {
    this.index = index;
    this.id = id;
    this.name = name;
    this.status = status;
    this.phoneNumber = countryCode + '-' + mobileNumber;
    this.lastLoginDate = lastLoginDate;
    this.updatedDate = updatedDate;
  }
}
