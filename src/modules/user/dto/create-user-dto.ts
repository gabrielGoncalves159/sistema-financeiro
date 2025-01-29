import { IsDateString, IsEmail, IsEnum, IsString } from "class-validator";
import { User, UserRole } from "src/entities/user.entity";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(User)
    role: UserRole;
}