import { AuthService } from './shared/auth.service';
import { Controller, UseGuards, Request, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from './shared/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string, password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }
}