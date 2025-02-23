import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateWalletDto } from './dto/create-wallet-dto';
import { UpdateWalletDto } from './dto/update-wallet-dto';
import { WalletDto } from './dto/waller-dto';
import { plainToInstance } from 'class-transformer';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { UserRole } from 'src/entities/user.entity';

@ApiTags('wallets')
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new wallet' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Wallet successfully created.' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request.' })
    async createWallet(@Body() dto: CreateWalletDto) : Promise<WalletDto> {
        const wallet = await this.walletService.createWallet(dto);
        return plainToInstance(WalletDto, wallet);
    }

    @Roles(UserRole.ADMIN, UserRole.USER)
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get wallet by ID' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Wallet found.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found.' })
    async getWalletById(@Param('id') id: number): Promise<WalletDto> {
        const wallet = await this.walletService.getWalletById(id);
        return plainToInstance(WalletDto, wallet);    
    }

    @Put(':id')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Update wallet information' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Wallet updated.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found.' })
    async updateWallet(@Param('id') id: number, @Body() updateData: UpdateWalletDto): Promise<WalletDto> {
        const wallet = await this.walletService.updateWallet(id, updateData);
        return plainToInstance(WalletDto, wallet);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete wallet' })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Wallet deleted.' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Wallet not found.' })
    async deleteWallet(@Param('id') id: number): Promise<void> {
        await this.walletService.deleteWallet(id);
    }
}
