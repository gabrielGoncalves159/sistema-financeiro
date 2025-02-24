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
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class WalletService {
    constructor(
        @InjectRepository(Wallet)
        private walletRepository: WalletRepository,
        @InjectRepository(User)
        private userRepository: UserRepository,
    ) {}

    async createWallet(createWalletDto: CreateWalletDto): Promise<Wallet> {
      const { name, userId } = createWalletDto;
      const user = await this.userRepository.findOne({where: {id: userId}});
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }
      const wallet = this.walletRepository.create({ name, user });
      return this.walletRepository.save(wallet);
    }

    async getWalletById(id: number): Promise<WalletDto> {
      const wallet = await this.walletRepository.findOne({ where: { id } });
      if (!wallet) {
        throw new NotFoundException(`Wallet with ID ${id} not found`);
      }
      return plainToInstance(WalletDto, wallet);
    }

    async findWallet(id: number): Promise<Wallet | null> {
      return await this.walletRepository.findOneBy({ id: id } );
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

    async getTotalBalanceWalletByUser(userId: number): Promise<number> {
      const wallets = await this.walletRepository.find({ where: { user: {id: userId} } });
      return wallets.reduce((acc, wallet) => acc + Number(wallet.balance), 0);
    }
    
    async updateWalletBalances(dto: CreateTransactionDto): Promise<void> {
      const {type, amount, targetWalletId, sourceWalletId} = dto;
      
      const sourceWallet = sourceWalletId ? await this.walletRepository.findOneBy( {id :sourceWalletId} ) : null;
      const targetWallet = await this.walletRepository.findOne({ where: { id: targetWalletId } })

      this.validateDataTransaction(type, sourceWallet, amount);

      if (!targetWallet) {
        throw new NotFoundException('Invalid target wallet');
      }
      
      if(sourceWallet && type === TypeTransaction.TRANSFER) {
        sourceWallet!.balance = Number(sourceWallet!.balance) - amount;      
        targetWallet!.balance = Number(targetWallet!.balance) + amount;      
        await this.walletRepository.save(sourceWallet!);
        
      } else if (type === TypeTransaction.EXPENSE) {
        targetWallet!.balance = Number(targetWallet!.balance) - amount;
      } else if(type === TypeTransaction.INCOME) {
        targetWallet!.balance = Number(targetWallet!.balance) + amount;
      }     
      
      await this.walletRepository.save(targetWallet!);
    }

    private validateDataTransaction(type: TypeTransaction, sourceWallet: Wallet|null, amount: number): void {
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

    async revertWalletBalances(transaction: Transaction): Promise<void> {
        const { amount, type, sourceWallet, targetWallet } = transaction;

        if(sourceWallet && type === TypeTransaction.TRANSFER) {
          sourceWallet!.balance = Number(sourceWallet!.balance) + amount;
          targetWallet!.balance = Number(targetWallet!.balance) - amount;      
          await this.walletRepository.save(sourceWallet!);
          
        } else if (type === TypeTransaction.EXPENSE) {
          targetWallet!.balance = Number(targetWallet!.balance) + amount;
        } else if(type === TypeTransaction.INCOME) {
          targetWallet!.balance = Number(targetWallet!.balance) - amount;
        }
        await this.walletRepository.save(targetWallet!);
    }
}
