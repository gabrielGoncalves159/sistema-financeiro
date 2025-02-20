import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusTransaction, TypeTransaction } from 'src/entities/transaction.entity';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';

export class CreateTransactionDto {
  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsString({ message: 'Category must be a string' })
  category: string;

  @IsNotEmpty({ message: 'Source wallet cannot be empty' })
  @ValidateNested()
  @Type(() => Wallet)
  sourceWallet: Wallet;

  @IsNotEmpty({ message: 'Target wallet cannot be empty' })
  @ValidateNested()
  @Type(() => Wallet)
  targetWallet: Wallet;

  @IsNotEmpty({ message: 'User cannot be empty' })
  @ValidateNested()
  @Type(() => User)
  user: User;

  @IsEnum(TypeTransaction, { message: 'Type must be a valid transaction type' })
  type: TypeTransaction;

  @IsEnum(StatusTransaction, { message: 'Status must be a valid transaction status' })
  status: StatusTransaction;
}
