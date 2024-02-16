import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    name: 'Jeremy',
    email: `jeremy${Math.floor(Math.random() * 1000)}@gmail.com`,
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

  it('Creacion de usuario', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toEqual(mockUser.name);
        expect(body.email).toEqual(mockUser.email);
      });
  });

  it('Creacion de usuario (Email ya existe)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send(mockUser)
      .expect(409)
      .expect(({ body }) => {
        expect(body.error).toEqual('Conflict');
        expect(body.message).toEqual('Ya existe un usuario con este correo');
      });
  });

  it('Propiedad faltante o vacia (name)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ ...mockUser, name: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message).toContain('name should not be empty');
      });
  });

  it('Propiedad faltante o vacia (email)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ ...mockUser, email: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain('email should not be empty');
      });
  });

  it('Email invalido (email)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ ...mockUser, email: 'jeremyhotmail.com' })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message).toContain('email must be an email');
      });
  });

  it('Propiedad faltante o vacia (password)', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({ ...mockUser, password: '' })
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message).toContain('password should not be empty');
      });
  });
});
