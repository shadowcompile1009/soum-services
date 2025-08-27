import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard([
  'legacy-jwt-auth',
  'legacy-admin-jwt-auth',
]) {}

export class LegacyAdminOnlyJwtAuthGuard extends AuthGuard([
  'legacy-admin-jwt-auth',
]) {}
