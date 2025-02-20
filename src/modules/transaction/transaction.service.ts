import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { WalletService } from 'src/modules/wallet/wallet.service';
import { UserService } from 'src/modules/user/user.service';
import { CreateTransactionDto } from './dto/create-transaction-dto';
import { StatusTransaction, Transaction, TypeTransaction } from 'src/entities/transaction.entity';
import { TransactionDto } from './dto/transaction-dto';
import { plainToInstance } from 'class-transformer';
import { TransactionRepository } from './transaction.repository';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private dataSource: DataSource,
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
    private readonly userService: UserService,
  ) {}

  async createTransaction(dto: CreateTransactionDto): Promise<TransactionDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {user, targetWallet} = dto;

      const walletFind = await this.walletService.getWalletById(targetWallet.id);
      const userFind = await this.userService.getUserById(user.id);

      if (!walletFind || !userFind) {
        throw new NotFoundException('Invalid target wallet or user ID');
      }

      this.validateTransaction(dto);

      const transaction = this.transactionRepository.create(dto);

      await this.walletService.updateWalletBalances(dto);

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

  private validateTransaction(dto: CreateTransactionDto): void {
    if (dto.sourceWallet) {
      if (dto.type === TypeTransaction.TRANSFER && dto.sourceWallet.balance < dto.amount) {
        throw new BadRequestException('Insufficient balance in source wallet');
      }
    } else {
      if (dto.type === TypeTransaction.TRANSFER) {
        throw new BadRequestException('Source wallet is required for transfer transactions');
      }
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
      ? await this.transactionRepository.find({ where: { user: { id: userId } } })
      : await this.transactionRepository.find();
    return transactions.map(transaction => plainToInstance(TransactionDto, transaction));
  }
}