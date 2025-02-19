import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //TODO: Criar tabela controladora
  // @ManyToOne(() => User, user => user.wallets)
  // userId: User;

  // @OneToMany(() => Transaction, transaction => transaction.sourceWallet)
  // transactions: Transaction[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
