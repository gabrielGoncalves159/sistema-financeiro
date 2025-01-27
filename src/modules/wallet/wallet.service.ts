import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { Transaction, TypeTransaction } from 'src/modules/transaction/transaction.entity';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
    ) {}

    async createWallet(name: string, userId: number): Promise<Wallet | null> {
      const wallet = this.walletRepository.create({ name, balance: 0, userId: { id: userId } });
      await this.walletRepository.save(wallet);
      return this.walletRepository.createQueryBuilder('wallet')
        .leftJoinAndSelect('wallet.userId', 'user')
        .where('wallet.id = :id', { id: wallet.id })
        .getOne();
    }

    async findAllWallet(userId: number): Promise<Wallet[]> {
        return this.walletRepository.findBy({ userId: {id: userId}});
    }

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

        if (wallet.transactions && wallet.transactions.length > 0) {
            throw new BadRequestException(`Wallet with ID ${wallet.id} has associated transactions and cannot be deleted`);
        }
    }

    async findWalletById(walletId: number): Promise<Wallet> {
        const wallet = await this.walletRepository.findOne({ where: { id: walletId } });
        if (!wallet) {
          throw new NotFoundException(`Wallet with ID ${walletId} not found`);
        }
        return wallet;
    }
    
    async updateWalletBalances(sourceWallet: Wallet | null, targetWallet: Wallet, amount: number, type: TypeTransaction): Promise<void> {
        if (type === TypeTransaction.TRANSFER) {
          sourceWallet!.balance = Number(sourceWallet!.balance) - amount;      
          targetWallet.balance = Number(targetWallet!.balance) + amount;
        } else if (type === TypeTransaction.INCOME) {
          targetWallet.balance = Number(targetWallet!.balance) + amount;
        } else if (type === TypeTransaction.EXPENSE) {
          sourceWallet!.balance = Number(sourceWallet!.balance) - amount;
        }
    
        if (sourceWallet) {
          await this.walletRepository.save(sourceWallet);
        }
        await this.walletRepository.save(targetWallet);
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

    async getUserBalance(userId: number): Promise<number> {
      const wallets = await this.walletRepository.find({ where: { userId: { id: userId } } });
      return wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);
    }
}
