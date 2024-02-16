import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const mockUser: CreateUserDto = {
    name: 'Jeremy',
    email: 'jeremy@gmail.com',
    password: '123456',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Creacion de nuevo usuario', () => {

    expect(service.create(mockUser)).toBeTruthy();
  });

  it('Busqueda de usuario', () => {
    expect(service.findByEmail('jeremy')).toBeTruthy();
  });

  it('Busqueda de usuario (No se encontro)', () => {
    expect(service.findByEmail('jeremy2')).toBeTruthy();
  });
});
