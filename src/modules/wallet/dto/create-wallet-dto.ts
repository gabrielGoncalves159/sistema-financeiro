import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ description: 'The name of the user', example: 'Personal Wallet', })
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @ApiProperty({ description: 'The ID of the user associated with the wallet', example: 1, })
  @IsNumber()
  @IsNotEmpty({ message: 'User cannot be empty' })
  userId: number;
}
