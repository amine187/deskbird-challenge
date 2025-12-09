import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExecutionContext } from '@nestjs/common';
import { ValidateUserResponseDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

describe(`Controller: ${AuthController.name}`, () => {
  let controller: AuthController;
  let mockAuthService: { login: jest.Mock };

  const mockUser: ValidateUserResponseDto = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(AuthGuard('local'))
      .useValue({
        canActivate: (context: ExecutionContext) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const req = context.switchToHttp().getRequest();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          req.user = mockUser; // mock the user here
          return true;
        },
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    const mockUser: ValidateUserResponseDto = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
    };

    it('should call authService.login with mocked req.user', () => {
      const loginResult = { accessToken: 'fake-token' };
      mockAuthService.login.mockReturnValue(loginResult);

      const req = { user: mockUser } as unknown as Request;
      const result = controller.login(req);

      expect(result).toEqual(loginResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });
});
