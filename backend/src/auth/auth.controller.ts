import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthPayloadDto } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authPayload: AuthPayloadDto) {
    return this.authService.login(authPayload);
  }
}
