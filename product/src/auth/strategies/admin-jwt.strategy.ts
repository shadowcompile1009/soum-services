import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class LegacyAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-auth',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.LEGACY_ADMIN_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId || payload.id;
    const roleId = payload.roleId;
    return { userId, roleId };
  }
}
