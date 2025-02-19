import { IsNumber, IsObject, IsString } from "class-validator";
import { User } from "src/entities/user.entity";

export class CreateWalletDto {

    @IsString()
    name: string;

    @IsObject()
    user: User;
}