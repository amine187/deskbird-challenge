import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto';
import { ValidateUserResponseDto, LoginResponseDto } from './dto/auth.dto';

describe(`Service: ${AuthService.name}`, () => {
  let service: AuthService;

  const mockUserEntity = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    passwordHash: 'hashedPassword',
    comparePassword: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return null if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      const payload: AuthPayloadDto = {
        email: 'test@example.com',
        password: 'pass',
      };
      const result = await service.validateUser(payload);

      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
        true,
      );
    });

    it('should return null if password does not match', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUserEntity);
      mockUserEntity.comparePassword.mockResolvedValue(false);

      const payload: AuthPayloadDto = {
        email: 'test@example.com',
        password: 'wrong',
      };
      const result = await service.validateUser(payload);

      expect(result).toBeNull();
      expect(mockUserEntity.comparePassword).toHaveBeenCalledWith('wrong');
    });

    it('should return ValidateUserResponseDto if password matches', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUserEntity);
      mockUserEntity.comparePassword.mockResolvedValue(true);

      const payload: AuthPayloadDto = {
        email: 'test@example.com',
        password: 'correct',
      };
      const result = await service.validateUser(payload);

      const expectedResult: ValidateUserResponseDto = {
        id: mockUserEntity.id,
        email: mockUserEntity.email,
        firstName: mockUserEntity.firstName,
        lastName: mockUserEntity.lastName,
        role: mockUserEntity.role,
      };

      expect(result).toEqual(expect.objectContaining(expectedResult));
    });
  });

  describe('login', () => {
    it('should return accessToken using jwtService.sign', () => {
      const userDto: ValidateUserResponseDto = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
      };

      const token = 'fake-jwt-token';
      mockJwtService.sign.mockReturnValue(token);

      const result: LoginResponseDto = service.login(userDto);

      expect(result).toEqual({ accessToken: token });
      expect(mockJwtService.sign).toHaveBeenCalledWith(userDto);
    });
  });
});
