import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class LegacyJwtStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
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
