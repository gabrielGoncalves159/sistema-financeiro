import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import config from './ormconfig';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [  
    TypeOrmModule.forRoot(config),
    UserModule,
    WalletModule,
    TransactionModule,
    AuthModule,
  ],
})
export class AppModule {}
