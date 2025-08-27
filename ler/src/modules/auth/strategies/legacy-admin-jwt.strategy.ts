import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LegacyAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'legacy-admin-jwt',
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
