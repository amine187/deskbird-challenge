import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto, UserResponseDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe(`Controller: ${UsersController.name}`, () => {
  let controller: UsersController;
  const mockUsersService = {
    findAll: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

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
  });

  it('should return all users', async () => {
    const mockUsers: UserResponseDto[] = [
      {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'john@example.com',
        firstName: 'john',
        lastName: 'white',
        role: 'admin',
      },
      {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'emily@example.com',
        firstName: 'emily',
        lastName: 'smith',
        role: 'user',
      },
    ];

    mockUsersService.findAll.mockResolvedValue(mockUsers);

    const result = await controller.findAll();

    expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUsers);
  });

  describe('update', () => {
    const userId = '00000000-0000-0000-0000-000000000000';

    it('should successfully update a user', async () => {
      const updateDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
      };
      const updatedUser: UserResponseDto = {
        id: userId,
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
      };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(userId, updateDto);

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const updateDto: UpdateUserDto = { firstName: 'Jane' };

      mockUsersService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockUsersService.update).toHaveBeenCalledWith(userId, updateDto);
    });
  });
});
