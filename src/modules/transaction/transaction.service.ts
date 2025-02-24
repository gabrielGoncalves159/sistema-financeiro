import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial } from 'typeorm';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { UserService } from 'src/modules/user/user.service';
import { CreateTransactionDto } from './dto/create-transaction-dto';
import { StatusTransaction, Transaction, TypeTransaction } from 'src/entities/transaction.entity';
import { TransactionDto } from './dto/transaction-dto';
import { plainToInstance } from 'class-transformer';
import { TransactionRepository } from './transaction.repository';
import { Wallet } from 'src/entities/wallet.entity';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(DataSource) private dataSource: DataSource,
    @InjectRepository(Transaction)
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<TransactionDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.walletService.updateWalletBalances(dto);

      const sourceWallet = await this.walletService.findWallet(dto.sourceWalletId);
      const targetWallet = await this.walletService.findWallet(dto.targetWalletId);
      const user = await this.userService.getUserById(dto.userId);

      if (!targetWallet || !user) {
        throw new NotFoundException('Invalid user or target wallet ID');
      }

      const transactionData: DeepPartial<Transaction> = {
        ...dto,
        sourceWallet,
        targetWallet,
        user,      
      };
      
      const transaction = this.transactionRepository.create(transactionData as Transaction);

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return plainToInstance(TransactionDto, transaction);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelTransaction(id: number): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({ where: { id }, relations: ['sourceWallet', 'targetWallet'] });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    if (transaction.status === StatusTransaction.CANCELED) {
      throw new BadRequestException(`Transaction with ID ${id} is already canceled`);
    }

    transaction.status = StatusTransaction.CANCELED;
    await this.walletService.revertWalletBalances(transaction);

    const canceledTransaction = await this.transactionRepository.save(transaction);
    return plainToInstance(TransactionDto, canceledTransaction);
  }

  async findAllTransactionsByUser(userId?: number): Promise<TransactionDto[]> {
    const transactions = userId
      ? await this.transactionRepository.find({ where: { user: { id: userId } }, relations: ['user', 'sourceWallet', 'targetWallet'] })
      : await this.transactionRepository.find({ relations: ['user', 'sourceWallet', 'targetWallet'] });
  
    return transactions.map(transaction => {
      const transactionDto = plainToInstance(TransactionDto, transaction);
      transactionDto.user = plainToInstance(UserDto, transaction.user);
      return transactionDto;
    });
  }
}