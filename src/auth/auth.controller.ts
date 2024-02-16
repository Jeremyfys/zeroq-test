import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { AuthService, PayloadJwt } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/signIn.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Metodo para generar un token de autenticacion
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() body: SignInDto) {
    return this.authService.generateTokenJwt(body as User);
  }

  /**
   * Metodo para refrescar el token de autenticacion
   */
  @ApiBearerAuth('auth-token')
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refreshTokenJwt(req.user as PayloadJwt);
  }

  /**
   * Metodo para refrescar el token de autenticacion
   */
  @ApiBearerAuth('auth-token')
  @UseGuards(JwtAuthGuard)
  @Post('randomString')
  randomString() {
    return 'Prueba para validar el token';
  }
}
