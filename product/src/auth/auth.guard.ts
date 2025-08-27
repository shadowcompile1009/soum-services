import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt-auth', 'admin-jwt-auth']) {}

export class LegacyAdminOnlyJwtAuthGuard extends AuthGuard([
  'admin-jwt-auth',
]) {}
