import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Wallet } from './wallet.entity';
import { User } from './user.entity';

export enum TypeTransaction {
  TRANSFER = 'transfer',
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum StatusTransaction {
  ACTIVE = 1,
  CANCELED = 0
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  amount: number = 0;

  @Column()
  category: string = '';

  @ManyToOne(() => Wallet, { nullable: true })
  sourceWallet: Wallet | null = new Wallet;

  @ManyToOne(() => Wallet, wallet => wallet.transactions)
  targetWallet: Wallet = new Wallet;

  @ManyToOne(() => User, user => user.id)
  user: User = new User;

  @Column({
    type: 'enum',
    enum: TypeTransaction,
    default: TypeTransaction.TRANSFER,
  })
  type: TypeTransaction = TypeTransaction.TRANSFER;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    default: StatusTransaction.ACTIVE
  })
  status: StatusTransaction = StatusTransaction.ACTIVE

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
