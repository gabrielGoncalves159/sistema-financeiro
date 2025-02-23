import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'User Test', })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ description: 'The email address of the user', example: 'user.teste@example.com', })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({ description: 'The password for the user', example: 'strongpassword123', })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  @ApiProperty({ description: 'The role assigned to the user', example: 'user or admin', })
  @IsEnum(UserRole, { message: 'Role must be a valid value' })
  @IsNotEmpty({ message: 'Role cannot be empty' })
  role: UserRole;
}
