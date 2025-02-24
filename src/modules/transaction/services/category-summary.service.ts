import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../transaction.repository';
import { CategotySummaryDTO } from '../dto/category-summary-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';

@Injectable()
export class CategorySummaryService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async getCategorySummary(dto: CategotySummaryDTO): Promise<any> {
    const { userId, category } = dto;
    const transactions = await this.transactionRepository.find({
      where: category ? { user: { id: userId }, category } : { user: { id: userId } },
    });
  
    const summary = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[transaction.category].income += Number(transaction.amount);
      } else {
        acc[transaction.category].expense += Number(transaction.amount);
      }
      return acc;
    }, {} as { [key: string]: { income: number; expense: number } });
  
    return summary;
  }
   
}
