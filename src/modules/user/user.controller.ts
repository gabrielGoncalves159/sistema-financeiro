import { Controller, Post, Body, Get, Param, Put, Delete, UseGuards, Request  } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { AuthService } from 'src/auth/shared/auth.service';
import { JwtAuthGuard } from 'src/auth/shared/jwt-auth.guard';

@Controller('user')
export class UserController {   
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async createUser(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.userService.createUser(name, email, password, role);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id:number ): Promise<User | null> {
    return this.userService.findUserById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number) : Promise<void> {
    return this.userService.deleteUser(id)
  }
}
