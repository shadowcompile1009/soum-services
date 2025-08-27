import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard([
  'legacy-jwt',
  'legacy-admin-jwt',
]) {}

@Injectable()
export class LegacyAdminOnlyJwtAuthGuard extends AuthGuard([
  'legacy-admin-jwt',
]) {}
