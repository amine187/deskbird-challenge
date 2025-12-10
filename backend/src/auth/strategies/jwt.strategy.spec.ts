import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import {
  ValidateJwtStrategyPayloadDto,
  ValidateJwtStrategyResponseDto,
} from '../dto';
import { UserRole } from '../../users/users.entity';

describe('Strategy: JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'JWT_SECRET') return 'supersecret';
        return null;
      }),
    } as unknown as ConfigService;

    jwtStrategy = new JwtStrategy(configService);
  });

  it('should return id and email when validate is called with valid payload', () => {
    const payload: ValidateJwtStrategyPayloadDto = {
      id: '123',
      email: 'test@example.com',
      role: UserRole.USER,
    } as ValidateJwtStrategyPayloadDto;

    const expected: ValidateJwtStrategyResponseDto = {
      id: '123',
      email: 'test@example.com',
      role: UserRole.USER,
    };

    const result = jwtStrategy.validate(payload);
    expect(result).toEqual(expected);
  });

  it('should throw UnauthorizedException if payload is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => jwtStrategy.validate(null as any)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if payload is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect(() => jwtStrategy.validate(undefined as any)).toThrow(
      UnauthorizedException,
    );
  });
});
