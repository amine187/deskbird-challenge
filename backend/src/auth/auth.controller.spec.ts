import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common';

describe(`Controller: ${AuthController.name}`, () => {
  let controller: AuthController;
  let mockAuthService: { login: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    const payload = { email: 'john@example.com', password: 'secret123' };

    it('should call authService.login with correct payload and return response', async () => {
      const expectedResponse = {
        accessToken: 'fake-jwt',
        user: { id: '1', email: payload.email },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(payload);

      expect(mockAuthService.login).toHaveBeenCalledWith(payload);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors thrown by authService.login', async () => {
      mockAuthService.login.mockRejectedValue(
        new HttpException('Invalid Credentials', 401),
      );

      await expect(controller.login(payload)).rejects.toThrow(
        new HttpException('Invalid Credentials', 401),
      );
    });
  });
});
