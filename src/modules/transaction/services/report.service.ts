import { Injectable } from '@nestjs/common';
import { Between } from 'typeorm';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { TypeTransaction } from 'src/entities/transaction.entity';
import { TransactionRepository } from '../transaction.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
  ) {}

  async getTransactionStatement(userId: number, startDate: Date, endDate: Date): Promise<any> {
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
      .reduce((acc, t) => acc - t.amount, 0);

    const totalBalance = await this.walletService.getBalanceWallet(userId);

    return {
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        status: t.status,
        category: t.category,
        description: t.description,
        createdAt: t.createdAt,
      })),
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance,
    };
  }
}
