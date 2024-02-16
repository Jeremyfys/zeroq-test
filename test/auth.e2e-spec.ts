import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    email: 'jeremy@gmail.com',
    password: '123456',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );
    await app.init();
  });

  it('Iniciar sesion', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(mockUser)
      .expect(201)
      .expect(({ body }) => {
        expect(typeof body.access_token).toBe('string');
      });
  });

  it('Fallo iniciar sesion (Usuario no existe)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...mockUser, email: 'wrong@gmail.com' })
      .expect(404)
      .expect(({ body }) => {
        expect(body.error).toEqual('Not Found');
        expect(body.message).toEqual('El usuario no existe');
      });
  });

  it('Fallo iniciar sesion (Contraseña incorrecta)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...mockUser, password: 'wrong' })
      .expect(401)
      .expect(({ body }) => {
        expect(body.error).toEqual('Unauthorized');
        expect(body.message).toEqual('La contraseña es incorrecta no coincide');
      });
  });
});
