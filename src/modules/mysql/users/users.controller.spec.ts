import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('should return validation error if body is invalid', async () => {
      const req = {
        body: {}, // empty body → invalid
      };

      const res = mockResponse();

      await controller.register(req, res, undefined);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          error: 'Bad Request',
        }),
      );
    });

    it('should create user successfully', async () => {
      const dto: CreateUserDto = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      } as any;

      const req = {
        body: dto,
      };

      const res = mockResponse();

      const file: Express.Multer.File = {
        fieldname: 'profile_image',
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
        buffer: Buffer.from('fake'),
      } as any;

      mockUsersService.create.mockResolvedValue({
        id: 1,
        ...dto,
      });

      await controller.register(req, res, file);

      expect(service.create).toHaveBeenCalledWith(expect.objectContaining(dto));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User registered successfully',
        }),
      );
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      mockUsersService.findAll.mockResolvedValue([{ id: 1 }]);

      const result = await controller.findAll();

      expect(result).toEqual([{ id: 1 }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should return one user', async () => {
      mockUsersService.findOne.mockResolvedValue({ id: 1 });

      const result = await controller.findOne('1');

      expect(result).toEqual({ id: 1 });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update user', async () => {
      mockUsersService.update.mockResolvedValue({ id: 1, name: 'Updated' });

      const result = await controller.update('1', { name: 'Updated' } as any);

      expect(result).toEqual({ id: 1, name: 'Updated' });
      expect(service.update).toHaveBeenCalledWith(1, expect.any(Object));
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
