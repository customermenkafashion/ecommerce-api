import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create and save user', async () => {
      const dto = { name: 'John' } as any;

      mockRepository.create.mockReturnValue(dto);
      mockRepository.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(dto);
      expect(result.id).toBe(1);
    });
  });

  describe('findAll()', () => {
    it('should return users', async () => {
      mockRepository.find.mockResolvedValue([{ id: 1 }]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: 1 }]);
    });
  });

  describe('findOne()', () => {
    it('should return user if found', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.findOne(1);

      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail()', () => {
    it('should find user by email', async () => {
      mockRepository.findOne.mockResolvedValue({ email: 'a@test.com' });

      const result = await service.findByEmail('a@test.com');

      expect(result).toEqual({ email: 'a@test.com' });
    });
  });

  describe('findOneByField()', () => {
    it('should find user dynamically', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.findOneByField('id', 1);

      expect(result).toEqual({ id: 1 });
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update()', () => {
    it('should update user', async () => {
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockRepository.findOne.mockResolvedValue({ id: 1 });

      const result = await service.update(1, { name: 'Updated' } as any);

      expect(result).toEqual({ id: 1 });
    });
  });

  describe('remove()', () => {
    it('should delete user', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if user not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });
});
