import { Controller, Post, Body, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction-dto';
import { TransactionDto } from './dto/transaction-dto';
import { ReportService } from './services/report.service';
import { WalletTransactionReportService } from './services/wallet-transaction-report.service';
import { CategorySummaryService } from './services/category-summary.service';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly reportService: ReportService,
    private readonly walletTransactionReportService: WalletTransactionReportService,
    private readonly categorySummaryService: CategorySummaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cancel a transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction successfully canceled.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async createTransaction(@Body() dto: CreateTransactionDto): Promise<TransactionDto> {
    return this.transactionService.createTransaction(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async cancelTransaction(@Param('id') id: number): Promise<TransactionDto> {
    return this.transactionService.cancelTransaction(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction found.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Transaction not found.' })
  async getTransactionById(@Param('id') id: number): Promise<TransactionDto[]> {
    return this.transactionService.findAllTransactionsByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('statement')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction statement' })
  @ApiResponse({ status: 200, description: 'Transaction statement generated.' })
  async getTransactionStatement(
    @Body('userId') userId: number,
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
  ): Promise<any> {
    return this.reportService.getTransactionStatement(userId, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('category-summary/:userId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category summary' })
  @ApiResponse({ status: 200, description: 'Category summary generated.' })
  async getCategorySummary(
    @Param('userId') userId: number,
    @Body('category') category?: string,
  ): Promise<any> {
    return this.categorySummaryService.getCategorySummary(userId, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('wallet/:walletId/user/:userId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transactions by wallet ID' })
  @ApiResponse({ status: 200, description: 'Transactions found.' })
  async getTransactionsByWalletId(
    @Param('walletId') walletId: number,
    @Param('userId') userId: number,
  ): Promise<TransactionDto[]> {
    return this.walletTransactionReportService.getTransactionsByWalletId(walletId, userId);
  }
}