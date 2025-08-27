import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LegacyAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'legacy-admin-jwt-auth',
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
    const userName = payload.userName || 'Not Found';
    const roleId = payload.roleId;
    return { userName, userId, roleId };
  }
}
