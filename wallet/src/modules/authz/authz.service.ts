import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHZ_PACKAGE_NAME,
  GetRoleRequest,
  GetRoleResponse,
  RoleServiceClient,
} from '../grpc/proto/authz.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthzService {
  private service: RoleServiceClient;

  constructor(
    @Inject(AUTHZ_PACKAGE_NAME)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service = this.client.getService<RoleServiceClient>('RoleService');
  }

  async getRole(payload: GetRoleRequest): Promise<GetRoleResponse> {
    return firstValueFrom(this.service.getRole(payload), {
      defaultValue: null,
    });
  }
}
