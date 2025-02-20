import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { WalletModule } from '../wallet/wallet.module';
import { UserModule } from '../user/user.module';
import { ReportService } from './services/report.service';
import { WalletTransactionReportService } from './services/wallet-transaction-report.service';
import { CategorySummaryService } from './services/category-summary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionRepository]),
    WalletModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService, 
    ReportService,
    WalletTransactionReportService,
    CategorySummaryService,
  ],
})
export class TransactionModule {}
