import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../transaction.repository';

@Injectable()
export class CategorySummaryService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getCategorySummary(userId: number, category?: string): Promise<any> {
    const transactions = await this.transactionRepository.find({
      where: category ? { user: { id: userId }, category } : { user: { id: userId } },
    });

    const summary = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[transaction.category].income += transaction.amount;
      } else {
        acc[transaction.category].expense += transaction.amount;
      }
      return acc;
    }, {});

    return summary;
  }
}
