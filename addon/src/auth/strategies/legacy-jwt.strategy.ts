import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LegacyJwtStrategy extends PassportStrategy(
  Strategy,
  'legacy-jwt-auth',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.LEGACY_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId || payload.id;
    return { userId, roleId: payload?.roleId };
  }
}
