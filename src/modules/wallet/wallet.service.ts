import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTransactionDto } from '../transaction/dto/create-transaction-dto';
import { Wallet } from 'src/entities/wallet.entity';
import { Transaction, TypeTransaction } from 'src/entities/transaction.entity';
import { CreateWalletDto } from './dto/create-wallet-dto';
import { UpdateWalletDto } from './dto/update-wallet-dto';
import { WalletDto } from './dto/waller-dto';
import { plainToInstance } from 'class-transformer';
import { WalletRepository } from './wallet.repository';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: WalletRepository,
    ) {}

    async createWallet(dto: CreateWalletDto): Promise<WalletDto> {
      const wallet = this.walletRepository.create(dto);
      const savedWallet = this.walletRepository.save(wallet);
      return plainToInstance(WalletDto, savedWallet);
    }

    async getWalletById(id: number): Promise<WalletDto> {
      const wallet = await this.walletRepository.findOne({ where: { id } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      return plainToInstance(WalletDto, wallet);
    }

    async updateWallet(id: number, updateData: UpdateWalletDto): Promise<WalletDto> {
      const wallet = await this.getWalletById(id);
      Object.assign(wallet, updateData);
      const updatedWallet = await this.walletRepository.save(wallet);
      return plainToInstance(WalletDto, updatedWallet);
    }

    async deleteWallet(id: number): Promise<void> {
      const wallet = await this.getWalletById(id);
      this.validatorsWalletForDelete(wallet);
      await this.walletRepository.delete(id);
    }

    validatorsWalletForDelete(wallet: WalletDto): void {

        if(!wallet) {
            throw new NotFoundException(`Wallet not found`)
        }

        if(wallet.balance > 0) {
            throw new BadRequestException(`The wallet cannot be deleted because it contains a balance of ${wallet.balance}.`);
        }
    }

    async getBalanceWallet(id: number): Promise<number> {
      const wallets = await this.walletRepository.find({ where: { id: id } });
      return wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);
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
}
