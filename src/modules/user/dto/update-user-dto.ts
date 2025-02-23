import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';
import { CreateUserDto } from './create-user-dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: 'The name of the user', example: 'User Test' })
  @IsString()
  name?: string;

  @ApiProperty({ description: 'The email address of the user', example: 'user.test@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email?: string;

  @ApiProperty({ description: 'The password for the user', example: 'newpassword123' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({ description: 'The role assigned to the user', example: 'user or admin' })
  @IsEnum(UserRole, { message: 'Role must be a valid value' })
  role?: UserRole;
}
