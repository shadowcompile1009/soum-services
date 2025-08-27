import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LegacyJwtStrategy extends PassportStrategy(
  Strategy,
  'legacy-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    const userId = payload.userId || payload.id;
    return { userId, roleId: payload?.roleId };
  }
}
