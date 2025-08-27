import { NextPageContext, Redirect } from 'next';
import { parseCookies } from 'nookies';
import { instanceToPlain } from 'class-transformer';

import { apiClient, apiClientV2, apiGatewayClient } from '@/api/client';
import {
  SignInDTO,
  AddNewUserDTO,
  VerifyTotpDTO,
  EditUserDTO,
} from '@src/types/dto';
import { FormState } from '@src/components/Settings/UsersApp/UserAppEditModal/types';

const DEFAULT_REDIRECT: Redirect = {
  destination: '/orders/new',
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
  users(limit: string, offset: string) {
    return `rest/api/v1/dm-users?limit=${limit}&offset=${offset}`;
  },
  roles() {
    return `authz/roles`;
  },
  addUser: 'rest/api/v1/dm-users',
  getUserRoles: 'rest/api/v1/dm-users/roles',
  editUser(userId: string) {
    return `rest/api/v1/dm-users/${userId}/role`;
  },
  editAppUser() {
    return `/authz/users`;
  },
  deleteUser(userId: string) {
    return `rest/api/v1/dm-users/${userId}`;
  },
};

export interface IUserResponse {
  id: string;
  email: string;
  phoneNumber: string;
  username: string;
  role: IRolesResponse;
}
export interface IUser {
  id: string;
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
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
export class User {
  static async getUsers({ limit, offset }: { limit: string; offset: string }) {
    const result = await apiClientV2.client.get(
      UserEndpoints.users(limit, offset)
    );
    return result.data.responseData;
  }

  static async getUserRoles() {
    const result = await apiClientV2.client.get(UserEndpoints.getUserRoles);

    return result.data.responseData;
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

  static mapUsers(users: IUserResponse[]): User[] {
    const mappedUsers = users?.map(
      (user: IUserResponse) =>
        new User({
          id: user?.id,
          name: user?.username,
          phoneNumber: user?.phoneNumber,
          email: user?.email,
          role: user?.role?.displayName,
        })
    );

    return instanceToPlain(mappedUsers) as User[];
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

  static async editAppUser(formValues: FormState, userId: string) {
    const result = await apiGatewayClient.client.post(
      UserEndpoints.editAppUser(),
      {
        id: userId,
        operatingModel: formValues.operatingModel,
        businessModel: formValues.businessModel,
        sellerType: formValues.sellerType,
        sellerCategory: formValues.sellerCategory,
        storeCRN: formValues.crNumber,
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

  public name: string;
  public email: string;
  public role: string;
  public phoneNumber: string;

  constructor({ id, role, name, email, phoneNumber }: IUser) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.email = email;
    this.phoneNumber = phoneNumber;
  }
}
