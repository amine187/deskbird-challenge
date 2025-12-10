import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import {
  ValidateJwtStrategyPayloadDto,
  ValidateJwtStrategyResponseDto,
} from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      ignoreExpiration: false,
    });
  }

  validate(
    payload: ValidateJwtStrategyPayloadDto,
  ): ValidateJwtStrategyResponseDto {
    if (!payload) {
      throw new UnauthorizedException('Invalid JWT token');
    }

    return { id: payload.id, email: payload.email };
  }
}
