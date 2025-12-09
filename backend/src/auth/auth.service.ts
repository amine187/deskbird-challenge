import { HttpException, Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users';
import { LoginResponseDto, ValidateUserResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<ValidateUserResponseDto | null> {
    const user = await this.usersService.findByEmail(email, true);

    if (!user) {
      return null;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(payload: AuthPayloadDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(payload);
    if (!user) throw new HttpException('Invalid Credentials', 401);

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
