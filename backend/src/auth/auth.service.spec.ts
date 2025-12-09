import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';
import { User } from '../users/users.entity';

describe(`Service: ${AuthService.name}`, () => {
  let authService: AuthService;
  let usersServiceMock: { findByEmail: jest.Mock };
  let jwtServiceMock: { sign: jest.Mock };

  const mockUser = {
    id: 'uuid-123',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    passwordHash: 'hashed-pass',
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    usersServiceMock = {
      findByEmail: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    const payload = { email: 'john@example.com', password: 'secret123' };

    it('should return accessToken and user on valid credentials', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      jwtServiceMock.sign.mockReturnValue('signed-jwt-token');

      const result = await authService.login(payload);

      expect(usersServiceMock.findByEmail).toHaveBeenCalledWith(
        payload.email,
        true,
      );
      expect(mockUser.comparePassword).toHaveBeenCalledWith(payload.password);
      expect(result).toEqual({
        accessToken: 'signed-jwt-token',
        user: expect.objectContaining({
          id: 'uuid-123',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
        }) as User,
      });
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw 401 if user is not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(null);

      await expect(authService.login(payload)).rejects.toThrow(
        new HttpException('Invalid Credentials', 401),
      );
    });

    it('should throw 401 if password does not match', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(authService.login(payload)).rejects.toThrow(
        new HttpException('Invalid Credentials', 401),
      );
    });
  });
});
