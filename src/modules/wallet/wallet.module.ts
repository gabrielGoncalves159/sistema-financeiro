import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/entities/wallet.entity';
import { WalletRepository } from './wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
  ],
  controllers: [
    WalletController,
  ],
  providers: [
    WalletService,
    WalletRepository,
  ],
  exports: [
    WalletService, 
    TypeOrmModule,
  ]
})
export class WalletModule {}
