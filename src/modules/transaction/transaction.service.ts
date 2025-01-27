import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusTransaction, Transaction, TypeTransaction } from './transaction.entity';
import { Between, Connection, Repository } from 'typeorm';
import { Wallet } from 'src/modules/wallet/wallet.entity';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
    private readonly connection: Connection,
  ) {}

  async createTransaction(
    amount: number,
    category: string,
    sourceWalletId: number | null,
    targetWalletId: number,
    userId: number,
    type: TypeTransaction = TypeTransaction.TRANSFER,
  ): Promise<Transaction> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let sourceWallet: Wallet | null = null;
      if (sourceWalletId) {
        sourceWallet = await this.walletService.findWalletById(sourceWalletId);
      }

      const targetWallet = await this.walletService.findWalletById(targetWalletId);
      const user = await this.userService.findUserById(userId);

      if (!targetWallet || !user) {
        throw new NotFoundException('Invalid target wallet or user ID');
      }

      this.validateTransaction(sourceWallet, amount, type);

      const transaction = this.transactionRepository.create({
        amount,
        category,
        type,
        sourceWallet: sourceWallet || undefined,
        targetWallet,
        user,
        status: StatusTransaction.ACTIVE,
      });

      await this.walletService.updateWalletBalances(sourceWallet, targetWallet, amount, type);

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private validateTransaction(sourceWallet: Wallet | null, amount: number, type: TypeTransaction): void {
    if (sourceWallet) {
      if (type === TypeTransaction.TRANSFER && sourceWallet.balance < amount) {
        throw new BadRequestException('Insufficient balance in source wallet');
      }
    } else {
      if (type === TypeTransaction.TRANSFER) {
        throw new BadRequestException('Source wallet is required for transfer transactions');
      }
    }
  }

  async cancelTransaction(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id }, relations: ['sourceWallet', 'targetWallet'] });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if (transaction.status === StatusTransaction.CANCELED) {
      throw new BadRequestException(`Transaction with ID ${id} is already canceled`);
    }

    transaction.status = StatusTransaction.CANCELED;
    await this.walletService.revertWalletBalances(transaction);

    return this.transactionRepository.save(transaction);
  }

  async findAllTransactionByUser(userId?: number): Promise<Transaction[]> {
    if (userId) {
      return await this.transactionRepository.findBy({ user: { id: userId } });
    } else {
      return await this.transactionRepository.find();
    }
  }

  async getTransactionsByWalletId(walletId: number, userId: number): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({ where: {targetWallet: { id: walletId } , user: {id: userId}}});
    return transactions;
  }

  async getTransactionStatement(userId: number, startDate: Date, endDate: Date): Promise<any> {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id: userId },
        createdAt: Between(startDate, endDate),
      },
    });

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc - t.amount, 0);
    const totalBalance = await this.walletService.getUserBalance(userId);

    return {
      transactions,
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: totalBalance
    };
  }

  async getCategorySummary(userId: number, category?: string): Promise<any> {
    let transactions;
    if (category) {
      transactions = await this.transactionRepository.find({
        where: { user: { id: userId }, category: category },
      });
    } else {
      transactions = await this.transactionRepository.find({
        where: { user: { id: userId } },
      });
    }

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