import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { WalletModule } from 'src/modules/wallet/wallet.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Transaction]), 
    WalletModule, 
    UserModule
],
    controllers: [TransactionController],
    providers: [TransactionService]
})
export class TransactionModule {}
