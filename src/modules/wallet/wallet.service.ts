import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../transaction/dto/create-transaction-dto';
import { Wallet } from 'src/entities/wallet.entity';
import { Transaction, TypeTransaction } from 'src/entities/transaction.entity';
import { CreateWalletDto } from './dto/create-wallet-dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) {}

    async createWallet(dto: CreateWalletDto): Promise<Wallet | null> {
      const { name } = dto;
      const wallet = this.walletRepository.create({ name });
      await this.walletRepository.save(wallet);
      return this.walletRepository.createQueryBuilder('wallet')
        .leftJoinAndSelect('wallet.userId', 'user')
        .where('wallet.id = :id', { id: wallet.id })
        .getOne();
    }

    // async findAllWallet(userId: number): Promise<Wallet[]> {
    //     return this.walletRepository.findBy({ userId: {id: userId}});
    // }

    async findOneWallet(id: number): Promise<Wallet | null> {
        return this.walletRepository.findOne({where: {id}});
    }

    async updateWallet(id: number, updateDataWallet: Partial<Wallet>): Promise<Wallet> {
        const wallet = await this.findOneWallet(id);
        if(!wallet) {
            throw new NotFoundException(`Wallet with Id ${id} not found`)
        }

        Object.assign(wallet, updateDataWallet);
        return this.walletRepository.save(wallet);
    }

    async deleteWallet(id: number): Promise<void> {
        const wallet = await this.findOneWallet(id);
        this.validatorsWalletForDelete(wallet);
        await this.walletRepository.delete(id);
    }

    validatorsWalletForDelete(wallet: Wallet | null): void {

        if(!wallet) {
            throw new NotFoundException(`Wallet not found`)
        }

        if(wallet.balance > 0) {
            throw new BadRequestException(`The wallet cannot be deleted because it contains a balance of ${wallet.balance}.`);
        }

        // if (wallet.transactions && wallet.transactions.length > 0) {
        //     throw new BadRequestException(`Wallet with ID ${wallet.id} has associated transactions and cannot be deleted`);
        // }
    }

    async findWalletById(wallet: Wallet): Promise<Wallet> {
        const walletFind = await this.walletRepository.findOne({ where: { id: wallet.id } });
        if (!wallet) {
          throw new NotFoundException(`Wallet with ID ${walletFind} not found`);
        }
        return wallet;
    }
    
    async updateWalletBalances(dto: CreateTransactionDto): Promise<void> {
        if (dto.type === TypeTransaction.TRANSFER) {
          dto.sourceWallet!.balance = Number(dto.sourceWallet!.balance) - dto.amount;      
          dto.targetWallet.balance = Number(dto.targetWallet!.balance) + dto.amount;
        } else if (dto.type === TypeTransaction.INCOME) {
          dto.targetWallet.balance = Number(dto.targetWallet!.balance) + dto.amount;
        } else if (dto.type === TypeTransaction.EXPENSE) {
          dto.sourceWallet!.balance = Number(dto.sourceWallet!.balance) - dto.amount;
        }
    
        if (dto.sourceWallet) {
          await this.walletRepository.save(dto.sourceWallet);
        }
        await this.walletRepository.save(dto.targetWallet);
    } 

    async revertWalletBalances(transaction: Transaction): Promise<void> {
        const { amount, type, sourceWallet, targetWallet } = transaction;
    
        if (type === TypeTransaction.TRANSFER) {
          sourceWallet!.balance += amount;
          targetWallet.balance -= amount;
        } else if (type === TypeTransaction.INCOME) {
          targetWallet.balance -= amount;
        } else if (type === TypeTransaction.EXPENSE) {
          sourceWallet!.balance += amount;
        }
    
        await this.updateWallet(sourceWallet!.id, sourceWallet!);
        await this.updateWallet(targetWallet.id, targetWallet);
    }

    // async getUserBalance(userId: number): Promise<number> {
    //   const wallets = await this.walletRepository.find({ where: { userId: { id: userId } } });
    //   return wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);
    // }
}
