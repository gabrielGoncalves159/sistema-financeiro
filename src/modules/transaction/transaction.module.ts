import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from 'src/entities/transaction.entity';
import { ReportService } from './services/report.service';
import { TransactionRepository } from './transaction.repository';
import { WalletModule } from '../wallet/wallet.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Transaction]), 
        WalletModule,
        UserModule,
    ],
    controllers: [
        TransactionController,
    ],
    providers: [
        TransactionService,
        TransactionRepository,
        ReportService,
    ],
    exports: [
        TransactionService
    ],
})
export class TransactionModule {}
