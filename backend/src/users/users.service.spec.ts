import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';

describe(`Service: ${UsersService.name}`, () => {
  let service: UsersService;
  let mockUsersRepository: { find: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockUsersRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return all users mapped to response DTOs', async () => {
    const users = [
      {
        id: 10,
        email: 'john@example.com',
        firstName: 'john',
        lastName: 'white',
        role: 'admin',
        password: 'password',
      },
      {
        id: 11,
        email: 'emily@example.com',
        firstName: 'emily',
        lastName: 'smith',
        role: 'user',
        password: 'password',
      },
    ];

    mockUsersRepository.find.mockResolvedValue(users);

    const result = await service.findAll();

    expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 10,
        email: 'john@example.com',
        firstName: 'john',
        lastName: 'white',
        role: 'admin',
      },
      {
        id: 11,
        email: 'emily@example.com',
        firstName: 'emily',
        lastName: 'smith',
        role: 'user',
      },
    ]);
  });
});
