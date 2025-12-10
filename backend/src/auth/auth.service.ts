import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginResponseDto, ValidateUserResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
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

  login(user: ValidateUserResponseDto): LoginResponseDto {
    return { accessToken: this.jwtService.sign(user) };
  }
}
