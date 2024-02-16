import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';

import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';

export interface PayloadJwt {
    email: string,
    iat: number,
    exp: number,
    token: string
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject('RedisClient') private readonly redisClient: Redis
  ) {}

  /**
   * Funcion que valida un usuario
   */
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const { password, ...rta } = user.toJSON();
        return rta;
      }
      throw new UnauthorizedException(
        'La contraseña es incorrecta no coincide',
      );
    }
    throw new NotFoundException('El usuario no existe');
  }

  /**
   * Funcion que genera un token
   */
  generateTokenJwt(user: User) {
    const payload = {
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Funcion que genera un token
   */
  async refreshTokenJwt(payload: PayloadJwt) {
    // Save token blacklist
    this.setTokenToBlacklist(payload.token);
    return {
      access_token: this.jwtService.sign({
        email: payload.email,
      }),
    };
  }

  async setTokenToBlacklist(token: string) {
    const saveBlacklist = await this.redisClient.set(`bl_${token}`, token, 'EX', 1800);
    return saveBlacklist;
  }

  async getTokenBlacklist(token: string) {
    return this.redisClient.get(`bl_${token}`);
  }
}
