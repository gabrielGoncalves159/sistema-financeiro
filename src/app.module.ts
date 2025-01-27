import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/user/user.entity';
import { UserModule } from './modules/user/user.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { Wallet } from './modules/wallet/wallet.entity';
import { Transaction } from './modules/transaction/transaction.entity';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Luffy1104@!1',
      database: 'sistema_financeiro',
      entities: [User, Wallet, Transaction],
      synchronize: true,
    }),
    UserModule,
    WalletModule,
    TransactionModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
