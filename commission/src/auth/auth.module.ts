import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { LegacyJwtStrategy } from './strategies/legacy-jwt.strategy';
import { LegacyAdminJwtStrategy } from './strategies/legacy-admin-jwt.strategy';

@Module({
  imports: [PassportModule, JwtModule],
  providers: [LegacyJwtStrategy, LegacyAdminJwtStrategy],
})
export class AuthModule {}
