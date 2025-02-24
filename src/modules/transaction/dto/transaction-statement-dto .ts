import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDateString } from 'class-validator';

export class GetTransactionStatementDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Period start date', example: '2025-01-01', format: 'date-time' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ description: 'Period end date', example: '2025-12-31', format: 'date-time' })
  @IsDateString()
  endDate: Date
}

import { TypeTransaction, StatusTransaction } from 'src/entities/transaction.entity';

export class TransactionResponseDto {
  id: number;
  type: TypeTransaction;
  amount: number;
  status: StatusTransaction;
  category: string;
  description: string;
  createdAt: Date;
}

export class TransactionStatementResponseDto {
  transactions: TransactionResponseDto[];
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}
