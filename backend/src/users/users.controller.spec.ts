import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto';

describe(`Controller: ${UsersController.name}`, () => {
  let controller: UsersController;
  const mockUsersService = {
    findAll: jest.fn(),
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
});
