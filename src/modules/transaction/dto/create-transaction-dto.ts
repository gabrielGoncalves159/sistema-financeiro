import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusTransaction, TypeTransaction } from 'src/entities/transaction.entity';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ description: 'The amount of the transaction', example: 100.00, })
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @ApiProperty({ description: 'The category of the transaction', example: 'Groceries',})  
  @IsString({ message: 'Category must be a string' })
  category: string;

  @ApiProperty({ description: 'The source wallet for the transaction', example: { id: 1 }, })
  @IsNotEmpty({ message: 'Source wallet cannot be empty' })
  @ValidateNested()
  @Type(() => Wallet)
  sourceWallet: Wallet;

  @ApiProperty({ description: 'The target wallet for the transaction', example: { id: 2 }, })
  @IsNotEmpty({ message: 'Target wallet cannot be empty' })
  @ValidateNested()
  @Type(() => Wallet)
  targetWallet: Wallet;

  @ApiProperty({ description: 'The type of the transaction', example: { id: 1 }, })
  @IsNotEmpty({ message: 'User cannot be empty' })
  @ValidateNested()
  @Type(() => User)
  user: User;

  @ApiProperty({ description: 'The type of the transaction', example: 'expense', })
  @IsEnum(TypeTransaction, { message: 'Type must be a valid transaction type' })
  type: TypeTransaction;

  @ApiProperty({ description: 'The status of the transaction', example: 'completed', })
  @IsEnum(StatusTransaction, { message: 'Status must be a valid transaction status' })
  status: StatusTransaction;
}
