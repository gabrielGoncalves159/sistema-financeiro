import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction, TypeTransaction } from './transaction.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createTransaction(
      @Body('amount') amount: number,
      @Body('category') category: string,
      @Body('sourceWalletId') sourceWalletId: number | null,
      @Body('targetWalletId') targetWalletId: number,
      @Body('userId') userId: number,
      @Body('type') type: TypeTransaction,
    ): Promise<Transaction> {
      return this.transactionService.createTransaction(amount, category, sourceWalletId, targetWalletId, userId, type);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('user/:userId')
    async getAllTransactionByUser(@Param('userId') userId: number): Promise<Transaction[]> {
      return this.transactionService.findAllTransactionByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('wallet/:walletId')
    async getTransactionsByWalletId(
      @Param('walletId') walletId: number,
      @Param('user') userId: number
    ): Promise<Transaction[]> {
      return await this.transactionService.getTransactionsByWalletId(walletId, userId);
    } 

    @UseGuards(JwtAuthGuard)
    @Patch('cancel/:id')
    async cancelTransaction(@Param('id') id: number): Promise<Transaction> {
      return this.transactionService.cancelTransaction(id);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('statement/:userId')
    async getTransactionStatement(
      @Param('userId') userId: number,
      @Query('startDate') startDate: string,
      @Query('endDate') endDate: string,
    ): Promise<any> {
      return this.transactionService.getTransactionStatement(userId, new Date(startDate), new Date(endDate));
    }
  
    @UseGuards(JwtAuthGuard)
    @Get('category-summary/:userId')
    async getCategorySummary(
      @Param('userId') userId: number,
      @Query('category') category?: string,
    ): Promise<any> {
      return this.transactionService.getCategorySummary(userId, category);
    }
}
