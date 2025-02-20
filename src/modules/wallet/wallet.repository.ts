import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Wallet } from '../../entities/wallet.entity';

@Injectable()
export class WalletRepository extends Repository<Wallet> {
  constructor(dataSource: DataSource) {
    super(Wallet, dataSource.manager);
  }
}