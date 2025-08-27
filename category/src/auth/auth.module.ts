import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { LegacyAdminJwtStrategy } from '@src/auth/strategies/legacy-admin-jwt.strategy';

import { LegacyJwtStrategy } from './strategies/legacy-jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [LegacyJwtStrategy, LegacyAdminJwtStrategy],
})
export class AuthModule {}
