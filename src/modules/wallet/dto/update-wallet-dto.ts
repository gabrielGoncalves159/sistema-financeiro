import { PartialType } from "@nestjs/mapped-types";
import { CreateWalletDto } from "./create-wallet-dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateWalletDto extends PartialType(CreateWalletDto){
      @ApiProperty({ description: 'The name of the user', example: 'Personal Wallet', })
      @IsString()
      @IsNotEmpty({ message: 'Name cannot be empty' })
      name: string;
}