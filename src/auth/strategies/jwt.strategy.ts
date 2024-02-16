import { Injectable, Inject } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from "@nestjs/config";

import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "../../users/entities/user.entity";
import config from "../../config";
/**
 * Clase JwtStrategy para la validacion del token
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(@Inject(config.KEY) configService: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
      
    });
  }
  async validate(payload: Partial<User>) {
    return { email: payload.email };
  }
}