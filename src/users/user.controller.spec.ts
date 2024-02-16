import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService = {
    create: jest.fn((dto) => { 
      return {
        _id: `${Math.random() * (1000 - 1) + 1}`, 
        ...dto, 
      };
    }),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
    .overrideProvider(UserService)
    .useValue(mockUserService)
    .compile();

    controller = module.get<UserController>(UserController);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();

  });

  it('Retorna el nuevo usuario', () => {
    const createUserDto = {
      name: 'Jeremy',
      email: 'jeremy@gmail.com',
      password: '123456',
    }

    expect(controller.create(createUserDto)).toEqual({ 
      _id: expect.any(String),
      ...createUserDto,
    });
  });


});
