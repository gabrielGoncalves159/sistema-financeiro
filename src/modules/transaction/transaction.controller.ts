import { Controller, Post, Body, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction-dto';
import { TransactionDto } from './dto/transaction-dto';
import { ReportService } from './services/report.service';
import { CategorySummaryService } from './services/category-summary.service';
import { GetTransactionStatementDto, TransactionStatementResponseDto } from './dto/transaction-statement-dto ';
import { CategotySummaryDTO } from './dto/category-summary-dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly reportService: ReportService,
    private readonly categorySummaryService: CategorySummaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transaction successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async createTransaction(@Body() dto: CreateTransactionDto): Promise<TransactionDto> {
    return this.transactionService.createTransaction(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a transaction' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction successfully canceled.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
  async cancelTransaction(@Param('id') id: number): Promise<TransactionDto> {
    return this.transactionService.cancelTransaction(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID user' })
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
  @ApiResponse({ status: HttpStatus.OK, description: 'Transaction statement generated.' })
  async getTransactionStatement(@Body() getTransactionStatementDto: GetTransactionStatementDto,): Promise<TransactionStatementResponseDto> {
    return this.reportService.getTransactionStatement(getTransactionStatementDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('category-summary')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get category summary' })
  @ApiResponse({ status: 200, description: 'Category summary generated.' })
  async getCategorySummary(@Body() category: CategotySummaryDTO,): Promise<any> {
    return this.categorySummaryService.getCategorySummary(category);
  }
}