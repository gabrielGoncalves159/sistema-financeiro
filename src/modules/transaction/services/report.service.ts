import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { TransactionRepository } from '../transaction.repository';
import { plainToInstance } from 'class-transformer';
import { TypeTransaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { GetTransactionStatementDto, TransactionResponseDto, TransactionStatementResponseDto } from '../dto/transaction-statement-dto ';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
  ) {}

  async getTransactionStatement(dto: GetTransactionStatementDto): Promise<TransactionStatementResponseDto> {
    const { userId, startDate, endDate } = dto;

    const transactions = await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, endDate),
      },
    });

    const income = transactions
      .filter(t => t.type === TypeTransaction.INCOME)
      .reduce((acc, t) => acc + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === TypeTransaction.EXPENSE)
      .reduce((acc, t) => acc + t.amount, 0);

    const totalBalance = await this.walletService.getTotalBalanceWalletByUser(userId);

    const transactionResponseDtos = transactions.map(t => plainToInstance(TransactionResponseDto, {
      id: t.id,
      type: t.type,
      amount: t.amount,
      status: t.status,
      category: t.category,
      description: t.description,
      createdAt: t.createdAt,
    }));

    const responseDto = plainToInstance(TransactionStatementResponseDto, {
      transactions: transactionResponseDtos,
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance,
    });

    return responseDto;
  }
}
