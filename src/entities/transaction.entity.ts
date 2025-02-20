import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/entities/user.entity';
import { Wallet } from 'src/entities/wallet.entity';

export enum TypeTransaction {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export enum StatusTransaction {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TypeTransaction })
  type: TypeTransaction;

  @Column({ type: 'enum', enum: StatusTransaction, default: StatusTransaction.PENDING })
  status: StatusTransaction;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Wallet, { nullable: true })
  sourceWallet: Wallet | null;

  @ManyToOne(() => Wallet)
  targetWallet: Wallet;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'text', nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
