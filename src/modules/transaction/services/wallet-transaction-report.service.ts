import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../transaction.repository';

@Injectable()
export class WalletTransactionReportService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getTransactionsByWalletId(walletId: number, userId: number): Promise<any> {
    const transactions = await this.transactionRepository.find({
      where: { targetWallet: { id: walletId }, user: { id: userId } },
    });

    return transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: t.amount,
      status: t.status,
      category: t.category,
      description: t.description,
      createdAt: t.createdAt,
    }));
  }
}
