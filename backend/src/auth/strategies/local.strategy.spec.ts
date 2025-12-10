import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from './local.strategy';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { ValidateUserResponseDto } from '../dto/auth.dto';

describe('Strategy: LocalStrategy', () => {
  let strategy: LocalStrategy;

  const mockUser: ValidateUserResponseDto = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
  };

  const mockAuthService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should return a user DTO when validate succeeds', async () => {
    mockAuthService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate('test@example.com', 'password');

    expect(result).toEqual(mockUser);
    expect(mockAuthService.validateUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should throw UnauthorizedException when validate fails', async () => {
    mockAuthService.validateUser.mockResolvedValue(null);

    await expect(
      strategy.validate('wrong@example.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockAuthService.validateUser).toHaveBeenCalledWith({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });
  });
});
