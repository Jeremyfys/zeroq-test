import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
/**
 * Servicio JWT Guard
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  /**
   * Metodo que verifica el token de autenticacion
   */
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('El token es requerido');
    }
    try {
      const payload = this.jwtService.verify(token);
      request['user'] = { ...payload, token };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'El token expiro. Vuelva a iniciar sesion',
        );
      }
    }

    const checkBlacklist = await this.authService.getTokenBlacklist(token);

    if (checkBlacklist) {
      throw new UnauthorizedException('El token suministrado se encuentra en la blacklist');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
