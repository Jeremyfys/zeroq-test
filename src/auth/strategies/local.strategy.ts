import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
/**
 * Clase LocalStrategy para la validacion del usuario y la contraseña al momento de logearse
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Funcion que valida el email y la contraseña
   */
  async validate(email: string, password: string) {
    const user = await this.authService.validateUser(email, password);
    return user;
  }
}
