import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LegacyAdminJwtStrategy } from '@src/auth/strategies/admin-jwt.strategy';

import { LegacyJwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [LegacyJwtStrategy, LegacyAdminJwtStrategy],
})
export class AuthModule {}
