import { IsEnum, IsNotEmptyObject, IsNumber, IsString } from "class-validator";
import { StatusTransaction, Transaction, TypeTransaction } from "src/entities/transaction.entity";
import { User } from "src/entities/user.entity";
import { Wallet } from "src/entities/wallet.entity";
import { FindOperator, IsNull } from "typeorm";

export class CreateTransactionDto {

    @IsNumber()
    amount: number;
    
    @IsString()
    category: string;

    sourceWallet: Wallet;

    @IsNotEmptyObject()
    targetWallet: Wallet;

    @IsNotEmptyObject()
    user: User;
    
    @IsEnum(Transaction)
    type: TypeTransaction;

    @IsEnum(Transaction)
    status: StatusTransaction;
}